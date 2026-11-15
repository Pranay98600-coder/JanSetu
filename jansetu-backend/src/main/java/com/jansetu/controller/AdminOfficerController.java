
package com.jansetu.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.jansetu.dto.request.AssignComplaintRequest;
import com.jansetu.dto.request.CreateOfficerRequest;
import com.jansetu.dto.response.ComplaintAssignmentResponse;
import com.jansetu.dto.response.OfficerResponse;
import com.jansetu.service.AdminOfficerService;
import com.jansetu.service.ResolutionEvidenceQueryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/officers")
public class AdminOfficerController {

    private final AdminOfficerService adminOfficerService;
    private final ResolutionEvidenceQueryService evidenceQueryService;

    public AdminOfficerController(
            AdminOfficerService adminOfficerService,
            ResolutionEvidenceQueryService evidenceQueryService) {

        this.adminOfficerService = adminOfficerService;
        this.evidenceQueryService = evidenceQueryService;
    }

    // 1. Create a new officer
    @PostMapping
    public ResponseEntity<OfficerResponse> createOfficer(
            @Valid @RequestBody CreateOfficerRequest request) {

        OfficerResponse response =
                adminOfficerService.createOfficer(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. Get all officers
    @GetMapping
    public ResponseEntity<List<OfficerResponse>> getAllOfficers() {

        return ResponseEntity.ok(
                adminOfficerService.getAllOfficers()
        );
    }

    // 3. Assign complaint to an officer
    @PatchMapping("/assign-complaint/{complaintId}")
    public ResponseEntity<ComplaintAssignmentResponse> assignComplaint(
            @PathVariable Long complaintId,
            @Valid @RequestBody AssignComplaintRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        ComplaintAssignmentResponse response =
                adminOfficerService.assignComplaint(
                        complaintId,
                        request,
                        jwt.getSubject()
                );

        return ResponseEntity.ok(response);
    }

    // 4. View complaint resolution evidence image
    @GetMapping("/{complaintId}/evidence/{evidenceId}/image")
    public ResponseEntity<Resource> viewEvidenceImage(
            @PathVariable Long complaintId,
            @PathVariable Long evidenceId) {

        Resource image = evidenceQueryService.getAdminEvidenceImage(
                complaintId,
                evidenceId
        );

        MediaType mediaType = MediaTypeFactory.getMediaType(image)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(image);
    }
}
