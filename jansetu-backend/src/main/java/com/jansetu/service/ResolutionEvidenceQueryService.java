package com.jansetu.service;

import com.jansetu.dto.response.ResolutionEvidenceResponse;
import com.jansetu.entity.Complaint;
import com.jansetu.entity.User;
import com.jansetu.enums.Role;
import com.jansetu.repository.ComplaintRepository;
import com.jansetu.repository.ResolutionEvidenceRepository;
import com.jansetu.repository.UserRepository;
import com.jansetu.entity.ResolutionEvidence;
import org.springframework.core.io.Resource;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ResolutionEvidenceQueryService {

    private final ResolutionEvidenceRepository evidenceRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final EvidenceStorageService evidenceStorageService;
    public ResolutionEvidenceQueryService(
            ResolutionEvidenceRepository evidenceRepository,
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            EvidenceStorageService evidenceStorageService) {

        this.evidenceRepository = evidenceRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.evidenceStorageService = evidenceStorageService;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    @Transactional(readOnly = true)
    public List<ResolutionEvidenceResponse> getCitizenEvidence(
            Long complaintId, String email) {

        User citizen = getUser(email);

        Complaint complaint = complaintRepository
                .findByIdAndCitizenId(complaintId, citizen.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Complaint not found"
                ));

        return evidenceRepository
                .findByComplaintIdOrderByUploadedAtDesc(complaint.getId())
                .stream()
                .map(ResolutionEvidenceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ResolutionEvidenceResponse> getOfficerEvidence(
            Long complaintId, String email) {

        User officer = getUser(email);

        if (officer.getRole() != Role.OFFICER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only officers can access this resource"
            );
        }

        Complaint complaint = complaintRepository
                .findByIdAndAssignedOfficerId(complaintId, officer.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assigned complaint not found"
                ));

        return evidenceRepository
                .findByComplaintIdOrderByUploadedAtDesc(complaint.getId())
                .stream()
                .map(ResolutionEvidenceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ResolutionEvidenceResponse> getAdminEvidence(
            Long complaintId) {

        if (!complaintRepository.existsById(complaintId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Complaint not found"
            );
        }

        return evidenceRepository
                .findByComplaintIdOrderByUploadedAtDesc(complaintId)
                .stream()
                .map(ResolutionEvidenceResponse::from)
                .toList();
    }
    private ResolutionEvidence getEvidence(
            Long complaintId,
            Long evidenceId) {

        return evidenceRepository
                .findByIdAndComplaintId(evidenceId, complaintId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Evidence not found"
                ));
    }

    @Transactional(readOnly = true)
    public Resource getCitizenEvidenceImage(
            Long complaintId,
            Long evidenceId,
            String email) {

        User citizen = getUser(email);

        complaintRepository.findByIdAndCitizenId(
                complaintId, citizen.getId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Complaint not found"
        ));

        ResolutionEvidence evidence = getEvidence(complaintId, evidenceId);

        return evidenceStorageService.load(evidence.getStoredFileName());
    }

    @Transactional(readOnly = true)
    public Resource getOfficerEvidenceImage(
            Long complaintId,
            Long evidenceId,
            String email) {

        User officer = getUser(email);

        if (officer.getRole() != Role.OFFICER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only officers can access this resource"
            );
        }

        complaintRepository.findByIdAndAssignedOfficerId(
                complaintId, officer.getId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Assigned complaint not found"
        ));

        ResolutionEvidence evidence = getEvidence(complaintId, evidenceId);

        return evidenceStorageService.load(evidence.getStoredFileName());
    }

    @Transactional(readOnly = true)
    public Resource getAdminEvidenceImage(
            Long complaintId,
            Long evidenceId) {

        ResolutionEvidence evidence = getEvidence(complaintId, evidenceId);

        return evidenceStorageService.load(evidence.getStoredFileName());
    }
}