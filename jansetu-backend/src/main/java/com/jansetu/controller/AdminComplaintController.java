
package com.jansetu.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.jansetu.dto.request.UpdateComplaintPriorityRequest;
import com.jansetu.dto.request.UpdateComplaintStatusRequest;
import com.jansetu.dto.response.AdminComplaintResponse;
import com.jansetu.dto.response.ComplaintStatusHistoryResponse;
import com.jansetu.dto.response.ResolutionEvidenceResponse;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.service.AdminComplaintService;
import com.jansetu.service.ComplaintCsvExportService;
import com.jansetu.service.ComplaintHistoryQueryService;
import com.jansetu.service.ResolutionEvidenceQueryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/complaints")
public class AdminComplaintController {

    private final AdminComplaintService adminComplaintService;
    private final ResolutionEvidenceQueryService evidenceQueryService;
    private final ComplaintHistoryQueryService historyQueryService;
    private final ComplaintCsvExportService complaintCsvExportService;

    public AdminComplaintController(
            AdminComplaintService adminComplaintService,
            ResolutionEvidenceQueryService evidenceQueryService,
            ComplaintHistoryQueryService historyQueryService,
            ComplaintCsvExportService complaintCsvExportService) {

        this.adminComplaintService = adminComplaintService;
        this.evidenceQueryService = evidenceQueryService;
        this.historyQueryService = historyQueryService;
        this.complaintCsvExportService = complaintCsvExportService;
    }

    // 1. Get all complaints with optional filters and pagination
    @GetMapping
    public ResponseEntity<Page<AdminComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) ComplaintPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AdminComplaintResponse> complaints =
                adminComplaintService.getAllComplaints(
                        status,
                        priority,
                        page,
                        size
                );

        return ResponseEntity.ok(complaints);
    }

    // 2. Update complaint status
    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateComplaintStatusRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        AdminComplaintResponse response =
                adminComplaintService.updateComplaintStatus(
                        id,
                        request.status(),
                        jwt.getSubject()
                );

        return ResponseEntity.ok(response);
    }

    // 3. Update complaint priority
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

    // 4. Get complaint resolution evidence
    @GetMapping("/{id}/evidence")
    public ResponseEntity<List<ResolutionEvidenceResponse>> getComplaintEvidence(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                evidenceQueryService.getAdminEvidence(id)
        );
    }

    // 5. Get complaint status history
    @GetMapping("/{id}/history")
    public ResponseEntity<List<ComplaintStatusHistoryResponse>> getHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                historyQueryService.getHistory(
                        id,
                        jwt.getSubject(),
                        "ADMIN"
                )
        );
    }

    // 6. Export all complaints as CSV
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportComplaints() {

        byte[] csvData = complaintCsvExportService.exportComplaints();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=jansetu-complaints.csv"
                )
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(csvData.length)
                .body(csvData);
    }
}
