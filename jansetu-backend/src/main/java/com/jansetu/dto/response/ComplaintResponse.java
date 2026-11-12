
package com.jansetu.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.jansetu.entity.Complaint;

public record ComplaintResponse(

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
    LocalDateTime createdAt,
    LocalDateTime updatedAt

) {

    public static ComplaintResponse from(Complaint complaint) {

        return new ComplaintResponse(
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
            complaint.getCreatedAt(),
            complaint.getUpdatedAt()
        );
    }
}
