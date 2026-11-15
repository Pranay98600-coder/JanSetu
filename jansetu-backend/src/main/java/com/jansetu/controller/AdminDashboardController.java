package com.jansetu.controller;

import com.jansetu.dto.response.DashboardSummaryResponse;
import com.jansetu.dto.response.OfficerPerformanceResponse;
import com.jansetu.service.AdminDashboardService;
import com.jansetu.dto.response.ComplaintStatusAnalyticsResponse;
import com.jansetu.dto.response.ComplaintCategoryAnalyticsResponse;
import com.jansetu.dto.response.ComplaintMonthlyAnalyticsResponse;
import com.jansetu.dto.response.ComplaintPriorityAnalyticsResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(
            AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary() {

        return ResponseEntity.ok(
                adminDashboardService.getDashboardSummary()
        );
    }
    
    @GetMapping("/status")
    public ResponseEntity<List<ComplaintStatusAnalyticsResponse>>
            getStatusAnalytics() {

        return ResponseEntity.ok(
                adminDashboardService.getStatusAnalytics()
        );
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<ComplaintCategoryAnalyticsResponse>>
            getCategoryAnalytics() {

        return ResponseEntity.ok(
                adminDashboardService.getCategoryAnalytics()
        );
    }
    
    @GetMapping("/priorities")
    public ResponseEntity<List<ComplaintPriorityAnalyticsResponse>>
            getPriorityAnalytics() {

        return ResponseEntity.ok(
                adminDashboardService.getPriorityAnalytics()
        );
    }
    

@GetMapping("/monthly")
public ResponseEntity<List<ComplaintMonthlyAnalyticsResponse>> getMonthlyAnalytics() {
    return ResponseEntity.ok(adminDashboardService.getMonthlyAnalytics());
}


@GetMapping("/officer-performance")
public ResponseEntity<List<OfficerPerformanceResponse>> getOfficerPerformance() {
    return ResponseEntity.ok(adminDashboardService.getOfficerPerformance());
}

}