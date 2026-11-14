package com.jansetu.dto.response;

import com.jansetu.entity.ComplaintStatusHistory;

import java.time.LocalDateTime;

public record ComplaintStatusHistoryResponse(
        Long id,
        Long complaintId,
        String previousStatus,
        String newStatus,
        Long changedById,
        String changedByName,
        String changedByRole,
        String remarks,
        LocalDateTime changedAt
) {

    public static ComplaintStatusHistoryResponse from(
            ComplaintStatusHistory history) {

        return new ComplaintStatusHistoryResponse(
                history.getId(),
                history.getComplaint().getId(),
                history.getPreviousStatus() == null
                        ? null
                        : history.getPreviousStatus().name(),
                history.getNewStatus().name(),
                history.getChangedBy().getId(),
                history.getChangedBy().getFullName(),
                history.getChangedBy().getRole().name(),
                history.getRemarks(),
                history.getChangedAt()
        );
    }
}