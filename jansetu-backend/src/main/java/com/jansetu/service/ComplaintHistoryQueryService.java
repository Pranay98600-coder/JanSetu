package com.jansetu.service;

import com.jansetu.dto.response.ComplaintStatusHistoryResponse;
import com.jansetu.entity.Complaint;
import com.jansetu.entity.User;
import com.jansetu.enums.Role;
import com.jansetu.repository.ComplaintRepository;
import com.jansetu.repository.ComplaintStatusHistoryRepository;
import com.jansetu.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ComplaintHistoryQueryService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public ComplaintHistoryQueryService(
            ComplaintRepository complaintRepository,
            ComplaintStatusHistoryRepository historyRepository,
            UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ComplaintStatusHistoryResponse> getHistory(
            Long complaintId, String email, String role) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        Complaint complaint;

        if ("CITIZEN".equals(role)) {
            complaint = complaintRepository
                    .findByIdAndCitizenId(complaintId, user.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Complaint not found"));

        } else if ("OFFICER".equals(role)) {
            complaint = complaintRepository
                    .findByIdAndAssignedOfficerId(complaintId, user.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Assigned complaint not found"));

        } else if ("ADMIN".equals(role) && user.getRole() == Role.ADMIN) {
            complaint = complaintRepository.findById(complaintId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Complaint not found"));
        } else {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Access denied");
        }

        return historyRepository
                .findByComplaintIdOrderByChangedAtAsc(complaint.getId())
                .stream()
                .map(ComplaintStatusHistoryResponse::from)
                .toList();
    }
}