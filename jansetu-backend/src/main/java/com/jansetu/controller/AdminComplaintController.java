
package com.jansetu.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jansetu.dto.response.AdminComplaintResponse;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.service.AdminComplaintService;
import com.jansetu.dto.request.UpdateComplaintPriorityRequest;
import com.jansetu.dto.request.UpdateComplaintStatusRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
@RestController
@RequestMapping("/api/admin/complaints")
public class AdminComplaintController {

    private final AdminComplaintService adminComplaintService;

    public AdminComplaintController(
            AdminComplaintService adminComplaintService) {

        this.adminComplaintService = adminComplaintService;
    }

    @GetMapping
    public ResponseEntity<Page<AdminComplaintResponse>> getAllComplaints(

            @RequestParam(required = false)
            ComplaintStatus status,

            @RequestParam(required = false)
            ComplaintPriority priority,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        Page<AdminComplaintResponse> complaints =
                adminComplaintService.getAllComplaints(
                        status,
                        priority,
                        page,
                        size
                );

        return ResponseEntity.ok(complaints);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateComplaintStatusRequest request) {

        AdminComplaintResponse response =
                adminComplaintService.updateComplaintStatus(
                        id,
                        request.status()
                );

        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{id}/priority")
    public ResponseEntity<AdminComplaintResponse> updateComplaintPriority(
            @PathVariable Long id,
            @Valid @RequestBody UpdateComplaintPriorityRequest request) {

        AdminComplaintResponse response =
                adminComplaintService.updateComplaintPriority(
                        id,
                        request.priority()
                );

        return ResponseEntity.ok(response);
    }
}
