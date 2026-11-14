package com.jansetu.service;

import com.jansetu.dto.request.CreateOfficerRequest;
import com.jansetu.dto.response.OfficerResponse;
import com.jansetu.entity.User;
import com.jansetu.enums.Role;
import com.jansetu.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.jansetu.dto.request.AssignComplaintRequest;
import com.jansetu.dto.response.ComplaintAssignmentResponse;
import com.jansetu.entity.Complaint;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.repository.ComplaintRepository;
import java.util.List;

@Service
public class AdminOfficerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryService complaintHistoryService;
    public AdminOfficerService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ComplaintRepository complaintRepository,
            ComplaintHistoryService complaintHistoryService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.complaintRepository = complaintRepository;
        this.complaintHistoryService = complaintHistoryService;
    }
    @Transactional
    public OfficerResponse createOfficer(CreateOfficerRequest request) {

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists"
            );
        }

        User officer = new User();

        officer.setFullName(request.fullName().trim());
        officer.setEmail(email);
        officer.setPassword(passwordEncoder.encode(request.password()));
        officer.setPhone(request.phone());
        officer.setRole(Role.OFFICER);

        User savedOfficer = userRepository.save(officer);

        return OfficerResponse.from(savedOfficer);
    }

    @Transactional(readOnly = true)
    public List<OfficerResponse> getAllOfficers() {

        return userRepository
                .findAllByRoleOrderByCreatedAtDesc(Role.OFFICER)
                .stream()
                .map(OfficerResponse::from)
                .toList();
    }
    
   

@Transactional
public ComplaintAssignmentResponse assignComplaint(
        Long complaintId,
        AssignComplaintRequest request,
        String adminEmail) {

    // 1. Find complaint
    Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Complaint not found"
            ));

    // 2. Identify authenticated admin
    User admin = userRepository.findByEmail(
            adminEmail.trim().toLowerCase()
    ).orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Admin not found"
    ));

    // 3. Verify selected officer
    User officer = userRepository.findById(request.officerId())
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Officer not found"
            ));

    if (officer.getRole() != Role.OFFICER) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Selected user is not an officer"
        );
    }

    // 4. Capture previous status
    ComplaintStatus previousStatus = complaint.getStatus();

    // 5. Assign officer and update status
    complaint.setAssignedOfficer(officer);
    complaint.setStatus(ComplaintStatus.ASSIGNED);

    Complaint savedComplaint =
            complaintRepository.save(complaint);

    // 6. Record assignment history
    complaintHistoryService.recordStatusChange(
            savedComplaint,
            previousStatus,
            ComplaintStatus.ASSIGNED,
            admin,
            "Complaint assigned to " + officer.getFullName()
    );

    // 7. Return response
    return ComplaintAssignmentResponse.from(savedComplaint);
}

}