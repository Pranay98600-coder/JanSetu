
package com.jansetu.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.jansetu.entity.Complaint;

public record AdminComplaintResponse(

    Long id,
    String complaintNumber,
    String title,
    String description,
    String category,
    String status,
    String priority,
    String address,
    BigDecimal latitude,
    BigDecimal longitude,

    Long citizenId,
    String citizenName,
    String citizenEmail,

    LocalDateTime createdAt,
    LocalDateTime updatedAt

) {

    public static AdminComplaintResponse from(Complaint complaint) {

        return new AdminComplaintResponse(
            complaint.getId(),
            complaint.getComplaintNumber(),
            complaint.getTitle(),
            complaint.getDescription(),
            complaint.getCategory(),
            complaint.getStatus().name(),
            complaint.getPriority().name(),
            complaint.getAddress(),
            complaint.getLatitude(),
            complaint.getLongitude(),

            complaint.getCitizen().getId(),
            complaint.getCitizen().getFullName(),
            complaint.getCitizen().getEmail(),

            complaint.getCreatedAt(),
            complaint.getUpdatedAt()
        );
    }
}
