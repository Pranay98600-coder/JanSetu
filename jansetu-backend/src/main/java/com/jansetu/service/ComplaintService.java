
package com.jansetu.service;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jansetu.dto.request.CreateComplaintRequest;
import com.jansetu.dto.response.ComplaintResponse;
import com.jansetu.entity.Complaint;
import com.jansetu.entity.User;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.enums.Role;
import com.jansetu.repository.ComplaintRepository;
import com.jansetu.repository.UserRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            UserRepository userRepository) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    // 1. Identify authenticated citizen
    private User getCitizen(String email) {

        User user = userRepository.findByEmail(
                email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found"
                ));

        if (user.getRole() != Role.CITIZEN) {
            throw new AccessDeniedException(
                    "Only citizens can access this operation"
            );
        }

        return user;
    }

    // 2. Generate tracking number
    private String generateComplaintNumber() {

        String number;

        do {
            number = "JAN-" + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 24)
                    .toUpperCase(Locale.ROOT);

        } while (complaintRepository
                .existsByComplaintNumber(number));

        return number;
    }

    // 3. Create complaint
    @Transactional
    public ComplaintResponse createComplaint(
            CreateComplaintRequest request,
            String email) {

        User citizen = getCitizen(email);

        Complaint complaint = new Complaint();

        complaint.setComplaintNumber(
                generateComplaintNumber());

        complaint.setTitle(request.title().trim());
        complaint.setDescription(
                request.description().trim());
        complaint.setCategory(request.category());
        complaint.setAddress(request.address().trim());

        complaint.setLatitude(request.latitude());
        complaint.setLongitude(request.longitude());

        complaint.setCitizen(citizen);

        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setPriority(ComplaintPriority.MEDIUM);

        Complaint savedComplaint =
                complaintRepository.saveAndFlush(complaint);

        return ComplaintResponse.from(savedComplaint);
    }

    // 4. Get all complaints of logged-in citizen
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(
            String email) {

        User citizen = getCitizen(email);

        return complaintRepository
                .findByCitizenIdOrderByCreatedAtDesc(
                        citizen.getId())
                .stream()
                .map(ComplaintResponse::from)
                .toList();
    }

    // 5. Get single complaint by ID
    @Transactional(readOnly = true)
    public ComplaintResponse getMyComplaintById(
            Long complaintId,
            String email) {

        User citizen = getCitizen(email);

        Complaint complaint = complaintRepository
                .findByIdAndCitizenId(
                        complaintId,
                        citizen.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Complaint not found"
                        ));

        return ComplaintResponse.from(complaint);
    }

    // 6. Track own complaint by reference number
    @Transactional(readOnly = true)
    public ComplaintResponse trackMyComplaint(
            String complaintNumber,
            String email) {

        User citizen = getCitizen(email);

        Complaint complaint = complaintRepository
                .findByComplaintNumber(complaintNumber)
                .orElseThrow(() ->
                        new ResponseStatusException(
                               HttpStatus.NOT_FOUND,
                                "Complaint not found"
                        ));

        if (!complaint.getCitizen().getId()
                .equals(citizen.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Complaint not found"
            );
        }

        return ComplaintResponse.from(complaint);
    }
}
