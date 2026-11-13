package com.jansetu.dto.response;

import com.jansetu.entity.Complaint;

import java.time.LocalDateTime;

public record ComplaintAssignmentResponse(
    Long complaintId,
    String complaintNumber,
    String status,
    Long officerId,
    String officerName,
    String officerEmail,
    LocalDateTime updatedAt
) {

    public static ComplaintAssignmentResponse from(Complaint complaint) {
        return new ComplaintAssignmentResponse(
            complaint.getId(),
            complaint.getComplaintNumber(),
            complaint.getStatus().name(),
            complaint.getAssignedOfficer().getId(),
            complaint.getAssignedOfficer().getFullName(),
            complaint.getAssignedOfficer().getEmail(),
            complaint.getUpdatedAt()
        );
    }
}