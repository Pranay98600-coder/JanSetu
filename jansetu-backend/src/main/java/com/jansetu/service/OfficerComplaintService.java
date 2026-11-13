package com.jansetu.service;

import com.jansetu.dto.request.UpdateOfficerComplaintStatusRequest;
import com.jansetu.dto.response.ComplaintResponse;
import com.jansetu.entity.Complaint;
import com.jansetu.entity.User;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.enums.Role;
import com.jansetu.repository.ComplaintRepository;
import com.jansetu.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jansetu.entity.ResolutionEvidence;
import com.jansetu.repository.ResolutionEvidenceRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import com.jansetu.dto.response.ResolutionEvidenceResponse;

@Service
public class OfficerComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ResolutionEvidenceRepository resolutionEvidenceRepository;
    private final EvidenceStorageService evidenceStorageService;
    public OfficerComplaintService(
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            ResolutionEvidenceRepository resolutionEvidenceRepository,
            EvidenceStorageService evidenceStorageService) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.resolutionEvidenceRepository = resolutionEvidenceRepository;
        this.evidenceStorageService = evidenceStorageService;
    }

    private User getOfficer(String email) {

        User officer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Officer account not found"
                ));

        if (officer.getRole() != Role.OFFICER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only officers can access this resource"
            );
        }

        return officer;
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyAssignedComplaints(String email) {

        User officer = getOfficer(email);

        return complaintRepository
                .findByAssignedOfficerIdOrderByCreatedAtDesc(officer.getId())
                .stream()
                .map(ComplaintResponse::from)
                .toList();
    }

    @Transactional
    public ComplaintResponse updateComplaintStatus(
            Long complaintId,
            String email,
            UpdateOfficerComplaintStatusRequest request) {

        User officer = getOfficer(email);

        Complaint complaint = complaintRepository
                .findByIdAndAssignedOfficerId(complaintId, officer.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assigned complaint not found"
                ));

        ComplaintStatus currentStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.status();

        if (newStatus == ComplaintStatus.IN_PROGRESS) {

        	if (newStatus != ComplaintStatus.IN_PROGRESS) {
        	    throw new ResponseStatusException(
        	            HttpStatus.BAD_REQUEST,
        	            "To resolve a complaint, submit resolution evidence"
        	    );
        	}

        	if (currentStatus != ComplaintStatus.ASSIGNED) {
        	    throw new ResponseStatusException(
        	            HttpStatus.BAD_REQUEST,
        	            "Only ASSIGNED complaints can be marked IN_PROGRESS"
        	    );
        	}

        } else if (newStatus == ComplaintStatus.RESOLVED) {

            if (currentStatus != ComplaintStatus.IN_PROGRESS) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Only IN_PROGRESS complaints can be marked RESOLVED"
                );
            }

        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Officers can only set IN_PROGRESS or RESOLVED status"
            );
        }

        complaint.setStatus(newStatus);

        Complaint updatedComplaint = complaintRepository.save(complaint);

        return ComplaintResponse.from(updatedComplaint);
    }
    
    @Transactional
    public List<ResolutionEvidenceResponse> submitResolutionEvidence(
            Long complaintId,
            String email,
            String description,
            List<MultipartFile> images) {

        User officer = getOfficer(email);

        Complaint complaint = complaintRepository
                .findByIdAndAssignedOfficerId(complaintId, officer.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assigned complaint not found"
                ));

        if (complaint.getStatus() != ComplaintStatus.IN_PROGRESS) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only IN_PROGRESS complaints can be resolved"
            );
        }

        if (description == null || description.isBlank()
                || description.trim().length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resolution description is required and must not exceed 2000 characters"
            );
        }

        if (images == null || images.isEmpty() || images.size() > 5) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Upload between 1 and 5 evidence images"
            );
        }

        List<String> storedFiles = new ArrayList<>();
        List<ResolutionEvidence> evidenceRecords = new ArrayList<>();

        try {
            for (MultipartFile image : images) {

                String storedFileName = evidenceStorageService.store(image);
                storedFiles.add(storedFileName);

                ResolutionEvidence evidence = new ResolutionEvidence();

                evidence.setComplaint(complaint);
                evidence.setOfficer(officer);
                evidence.setDescription(description.trim());
                evidence.setOriginalFileName(image.getOriginalFilename() == null
                        ? "evidence-image"
                        : image.getOriginalFilename());
                evidence.setStoredFileName(storedFileName);
                evidence.setContentType(image.getContentType());

                evidenceRecords.add(evidence);
            }

            List<ResolutionEvidence> savedEvidence =
                    resolutionEvidenceRepository.saveAll(evidenceRecords);

            complaint.setStatus(ComplaintStatus.RESOLVED);
            complaintRepository.save(complaint);

            return savedEvidence.stream()
                    .map(ResolutionEvidenceResponse::from)
                    .toList();

        } catch (RuntimeException exception) {

            for (String storedFile : storedFiles) {
                try {
                    evidenceStorageService.delete(storedFile);
                } catch (RuntimeException cleanupException) {
                    exception.addSuppressed(cleanupException);
                }
            }

            throw exception;
        }
    }
}