package com.jansetu.controller;

import com.jansetu.dto.request.CreateOfficerRequest;
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

@RestController
@RequestMapping("/api/admin/officers")
public class AdminOfficerController {

    private final AdminOfficerService adminOfficerService;

    public AdminOfficerController(AdminOfficerService adminOfficerService) {
        this.adminOfficerService = adminOfficerService;
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
}