
package com.jansetu.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.jansetu.dto.request.CreateComplaintRequest;
import com.jansetu.dto.response.ComplaintResponse;
import com.jansetu.service.ComplaintService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/citizen/complaints")
@Validated
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
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
}
