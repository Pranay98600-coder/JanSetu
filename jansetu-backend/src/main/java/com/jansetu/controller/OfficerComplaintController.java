package com.jansetu.controller;

import com.jansetu.dto.request.UpdateOfficerComplaintStatusRequest;
import com.jansetu.dto.response.ComplaintResponse;
import com.jansetu.service.OfficerComplaintService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.jansetu.dto.response.ResolutionEvidenceResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/officer/complaints")
public class OfficerComplaintController {

    private final OfficerComplaintService officerComplaintService;

    public OfficerComplaintController(
            OfficerComplaintService officerComplaintService) {
        this.officerComplaintService = officerComplaintService;
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getMyAssignedComplaints(
            @AuthenticationPrincipal Jwt jwt) {

        List<ComplaintResponse> complaints =
                officerComplaintService.getMyAssignedComplaints(
                        jwt.getSubject()
                );

        return ResponseEntity.ok(complaints);
    }

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
}