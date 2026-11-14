
package com.jansetu.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jansetu.dto.request.UpdateOfficerComplaintStatusRequest;
import com.jansetu.dto.response.ComplaintResponse;
import com.jansetu.dto.response.ComplaintStatusHistoryResponse;
import com.jansetu.dto.response.ResolutionEvidenceResponse;
import com.jansetu.service.ComplaintHistoryQueryService;
import com.jansetu.service.OfficerComplaintService;
import com.jansetu.service.ResolutionEvidenceQueryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/officer/complaints")
public class OfficerComplaintController {

    private final OfficerComplaintService officerComplaintService;
    private final ResolutionEvidenceQueryService evidenceQueryService;
    private final ComplaintHistoryQueryService historyQueryService;

    public OfficerComplaintController(
            OfficerComplaintService officerComplaintService,
            ResolutionEvidenceQueryService evidenceQueryService,
            ComplaintHistoryQueryService historyQueryService) {

        this.officerComplaintService = officerComplaintService;
        this.evidenceQueryService = evidenceQueryService;
        this.historyQueryService = historyQueryService;
    }

    // 1. Get all complaints assigned to the logged-in officer
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getMyAssignedComplaints(
            @AuthenticationPrincipal Jwt jwt) {

        List<ComplaintResponse> complaints =
                officerComplaintService.getMyAssignedComplaints(
                        jwt.getSubject()
                );

        return ResponseEntity.ok(complaints);
    }

    // 2. Update complaint status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOfficerComplaintStatusRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        ComplaintResponse response =
                officerComplaintService.updateComplaintStatus(
                        id,
                        jwt.getSubject(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // 3. Submit resolution evidence
    @PostMapping(
            value = "/{id}/resolution-evidence",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<ResolutionEvidenceResponse>> submitResolutionEvidence(
            @PathVariable Long id,
            @RequestParam("description") String description,
            @RequestParam("images") List<MultipartFile> images,
            @AuthenticationPrincipal Jwt jwt) {

        List<ResolutionEvidenceResponse> response =
                officerComplaintService.submitResolutionEvidence(
                        id,
                        jwt.getSubject(),
                        description,
                        images
                );

        return ResponseEntity.ok(response);
    }

    // 4. Get complaint resolution evidence
    @GetMapping("/{id}/evidence")
    public ResponseEntity<List<ResolutionEvidenceResponse>> getComplaintEvidence(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                evidenceQueryService.getOfficerEvidence(
                        id,
                        jwt.getSubject()
                )
        );
    }

    // 5. View resolution evidence image
    @GetMapping("/{complaintId}/evidence/{evidenceId}/image")
    public ResponseEntity<Resource> viewEvidenceImage(
            @PathVariable Long complaintId,
            @PathVariable Long evidenceId,
            @AuthenticationPrincipal Jwt jwt) {

        Resource image = evidenceQueryService.getOfficerEvidenceImage(
                complaintId,
                evidenceId,
                jwt.getSubject()
        );

        MediaType mediaType = MediaTypeFactory.getMediaType(image)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(image);
    }

    // 6. Get complaint status history
    @GetMapping("/{id}/history")
    public ResponseEntity<List<ComplaintStatusHistoryResponse>> getHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                historyQueryService.getHistory(
                        id,
                        jwt.getSubject(),
                        "OFFICER"
                )
        );
    }
}
