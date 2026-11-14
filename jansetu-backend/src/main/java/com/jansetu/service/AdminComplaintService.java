
package com.jansetu.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.jansetu.entity.User;
import com.jansetu.dto.response.AdminComplaintResponse;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.repository.ComplaintRepository;
import com.jansetu.repository.UserRepository;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.entity.Complaint;
import com.jansetu.enums.ComplaintStatus;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
@Service
public class AdminComplaintService {

	private final ComplaintRepository complaintRepository;
	private final ComplaintHistoryService complaintHistoryService;
	private final UserRepository userRepository;

	public AdminComplaintService(
	        ComplaintRepository complaintRepository,
	        UserRepository userRepository,
	        ComplaintHistoryService complaintHistoryService) {

	    this.complaintRepository = complaintRepository;
	    this.userRepository = userRepository;
	    this.complaintHistoryService = complaintHistoryService;
	}

    @Transactional(readOnly = true)
    public Page<AdminComplaintResponse> getAllComplaints(
            ComplaintStatus status,
            ComplaintPriority priority,
            int page,
            int size) {

        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid pagination parameters"
            );
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<com.jansetu.entity.Complaint> complaints;

        if (status != null && priority != null) {

            complaints = complaintRepository
                    .findByStatusAndPriority(
                            status, priority, pageable);

        } else if (status != null) {

            complaints = complaintRepository
                    .findByStatus(status, pageable);

        } else if (priority != null) {

            complaints = complaintRepository
                    .findByPriority(priority, pageable);

        } else {

            complaints = complaintRepository
                    .findAllBy(pageable);
        }

        return complaints.map(AdminComplaintResponse::from);
    }
    
    @Transactional
    public AdminComplaintResponse updateComplaintStatus(
            Long complaintId,
            ComplaintStatus newStatus,
            String adminEmail) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Complaint not found"
                ));

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Admin not found"
                ));

        ComplaintStatus previousStatus = complaint.getStatus();

        complaint.setStatus(newStatus);

        Complaint updated = complaintRepository.save(complaint);

        complaintHistoryService.recordStatusChange(
                updated,
                previousStatus,
                newStatus,
                admin,
                "Status updated by administrator"
        );

        return AdminComplaintResponse.from(updated);
    }
    
    @Transactional
    public AdminComplaintResponse updateComplaintPriority(
            Long complaintId,
            ComplaintPriority newPriority) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Complaint not found"
                ));

        complaint.setPriority(newPriority);

        Complaint updatedComplaint = complaintRepository.save(complaint);

        return AdminComplaintResponse.from(updatedComplaint);
    }
}
