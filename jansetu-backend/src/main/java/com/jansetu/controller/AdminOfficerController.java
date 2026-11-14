package com.jansetu.controller;

import com.jansetu.dto.request.CreateOfficerRequest;
import com.jansetu.service.ResolutionEvidenceQueryService;
import com.jansetu.dto.response.OfficerResponse;
import com.jansetu.service.AdminOfficerService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.jansetu.dto.request.AssignComplaintRequest;
import com.jansetu.dto.response.ComplaintAssignmentResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.HttpHeaders;
@RestController
@RequestMapping("/api/admin/officers")
public class AdminOfficerController {

    private final AdminOfficerService adminOfficerService;
    private final ResolutionEvidenceQueryService evidenceQueryService;
    public AdminOfficerController(AdminOfficerService adminOfficerService,ResolutionEvidenceQueryService evidenceQueryService) {
        this.adminOfficerService = adminOfficerService;
        this.evidenceQueryService = evidenceQueryService;
    }

    @PostMapping
    public ResponseEntity<OfficerResponse> createOfficer(
            @Valid @RequestBody CreateOfficerRequest request) {

        OfficerResponse response =
                adminOfficerService.createOfficer(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OfficerResponse>> getAllOfficers() {

        return ResponseEntity.ok(
                adminOfficerService.getAllOfficers()
        );
    }
    
    @PatchMapping("/assign-complaint/{complaintId}")
    public ResponseEntity<ComplaintAssignmentResponse> assignComplaint(
            @PathVariable Long complaintId,
            @Valid @RequestBody AssignComplaintRequest request) {

        ComplaintAssignmentResponse response =
                adminOfficerService.assignComplaint(complaintId, request);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{complaintId}/evidence/{evidenceId}/image")
    public ResponseEntity<Resource> viewEvidenceImage(
            @PathVariable Long complaintId,
            @PathVariable Long evidenceId) {

        Resource image = evidenceQueryService.getAdminEvidenceImage(
                complaintId, evidenceId
        );

        MediaType mediaType = MediaTypeFactory.getMediaType(image)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(image);
    }
}