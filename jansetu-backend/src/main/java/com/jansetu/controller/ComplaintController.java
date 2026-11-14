
package com.jansetu.controller;

import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.jansetu.dto.request.CreateComplaintRequest;
import com.jansetu.dto.response.ComplaintResponse;
import com.jansetu.dto.response.ComplaintStatusHistoryResponse;
import com.jansetu.service.ComplaintService;
import com.jansetu.service.ComplaintHistoryQueryService;
import jakarta.validation.Valid;
import com.jansetu.dto.response.ResolutionEvidenceResponse;
import com.jansetu.service.ResolutionEvidenceQueryService;
import java.util.List;
@RestController
@RequestMapping("/api/citizen/complaints")
@Validated
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ResolutionEvidenceQueryService evidenceQueryService;
    private final ComplaintHistoryQueryService historyQueryService;
    public ComplaintController(
            ComplaintService complaintService,
            ResolutionEvidenceQueryService evidenceQueryService,
            ComplaintHistoryQueryService historyQueryService) {

        this.complaintService = complaintService;
        this.evidenceQueryService = evidenceQueryService;
        this.historyQueryService = historyQueryService;
    }

    // 1. Submit a new complaint
    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody CreateComplaintRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        ComplaintResponse response =
                complaintService.createComplaint(
                        request,
                        jwt.getSubject()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. Get all complaints of logged-in citizen
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            @AuthenticationPrincipal Jwt jwt) {

        List<ComplaintResponse> complaints =
                complaintService.getMyComplaints(
                        jwt.getSubject()
                );

        return ResponseEntity.ok(complaints);
    }

    // 3. Get one complaint by database ID
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getMyComplaintById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        ComplaintResponse response =
                complaintService.getMyComplaintById(
                        id,
                        jwt.getSubject()
                );

        return ResponseEntity.ok(response);
    }

    // 4. Track complaint using tracking number
    @GetMapping("/track/{complaintNumber}")
    public ResponseEntity<ComplaintResponse> trackMyComplaint(
            @PathVariable String complaintNumber,
            @AuthenticationPrincipal Jwt jwt) {

        ComplaintResponse response =
                complaintService.trackMyComplaint(
                        complaintNumber,
                        jwt.getSubject()
                );

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/evidence")
    public ResponseEntity<List<ResolutionEvidenceResponse>> getComplaintEvidence(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                evidenceQueryService.getCitizenEvidence(
                        id,
                        jwt.getSubject()
                )
        );
    }
    
    @GetMapping("/{complaintId}/evidence/{evidenceId}/image")
    public ResponseEntity<Resource> viewEvidenceImage(
            @PathVariable Long complaintId,
            @PathVariable Long evidenceId,
            @AuthenticationPrincipal Jwt jwt) {

        Resource image = evidenceQueryService.getCitizenEvidenceImage(
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
    
    @GetMapping("/{id}/history")
    public ResponseEntity<List<ComplaintStatusHistoryResponse>> getHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                historyQueryService.getHistory(
                        id, jwt.getSubject(), "CITIZEN")
        );
    }
}
