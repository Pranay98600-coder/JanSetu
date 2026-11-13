package com.jansetu.dto.response;

import com.jansetu.entity.ResolutionEvidence;

import java.time.LocalDateTime;

public record ResolutionEvidenceResponse(
        Long id,
        Long complaintId,
        String description,
        String originalFileName,
        String contentType,
        LocalDateTime uploadedAt
) {

    public static ResolutionEvidenceResponse from(
            ResolutionEvidence evidence) {

        return new ResolutionEvidenceResponse(
                evidence.getId(),
                evidence.getComplaint().getId(),
                evidence.getDescription(),
                evidence.getOriginalFileName(),
                evidence.getContentType(),
                evidence.getUploadedAt()
        );
    }
}