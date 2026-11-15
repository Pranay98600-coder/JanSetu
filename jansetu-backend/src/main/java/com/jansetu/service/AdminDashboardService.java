package com.jansetu.service;

import com.jansetu.dto.response.DashboardSummaryResponse;
import com.jansetu.dto.response.OfficerPerformanceResponse;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.repository.ComplaintRepository;
import com.jansetu.dto.response.ComplaintStatusAnalyticsResponse;
import com.jansetu.dto.response.ComplaintCategoryAnalyticsResponse;
import com.jansetu.dto.response.ComplaintMonthlyAnalyticsResponse;
import com.jansetu.dto.response.ComplaintPriorityAnalyticsResponse;

import java.util.Arrays;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDashboardService {

    private final ComplaintRepository complaintRepository;

    public AdminDashboardService(
            ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {

        long total = complaintRepository.count();

        return new DashboardSummaryResponse(

                total,

                complaintRepository.countByStatus(ComplaintStatus.SUBMITTED),
                complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW),
                complaintRepository.countByStatus(ComplaintStatus.ASSIGNED),
                complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS),
                complaintRepository.countByStatus(ComplaintStatus.RESOLVED),
                complaintRepository.countByStatus(ComplaintStatus.REJECTED),
                complaintRepository.countByStatus(ComplaintStatus.REOPENED),
                complaintRepository.countByStatus(ComplaintStatus.CLOSED),

                complaintRepository.countByPriority(ComplaintPriority.LOW),
                complaintRepository.countByPriority(ComplaintPriority.MEDIUM),
                complaintRepository.countByPriority(ComplaintPriority.HIGH),
                complaintRepository.countByPriority(ComplaintPriority.CRITICAL)
        );
    }
    @Transactional(readOnly = true)
    public List<ComplaintStatusAnalyticsResponse> getStatusAnalytics() {

        return complaintRepository.countComplaintsByStatus()
                .stream()
                .map(row -> new ComplaintStatusAnalyticsResponse(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .toList();
    }
    @Transactional(readOnly = true)
    public List<ComplaintCategoryAnalyticsResponse> getCategoryAnalytics() {

        return complaintRepository.countComplaintsByCategory()
                .stream()
                .map(row -> new ComplaintCategoryAnalyticsResponse(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<ComplaintPriorityAnalyticsResponse> getPriorityAnalytics() {

        return Arrays.stream(ComplaintPriority.values())
                .map(priority -> new ComplaintPriorityAnalyticsResponse(
                        priority.name(),
                        complaintRepository.countByPriority(priority)
                ))
                .toList();
    }
    

@Transactional(readOnly = true)
public List<ComplaintMonthlyAnalyticsResponse> getMonthlyAnalytics() {
    return complaintRepository.countMonthlyComplaints()
        .stream()
        .map(row -> new ComplaintMonthlyAnalyticsResponse(
            (String) row[0],
            ((Number) row[1]).longValue()
        ))
        .toList();
}


@Transactional(readOnly = true)
public List<OfficerPerformanceResponse> getOfficerPerformance() {

    return complaintRepository.getOfficerPerformance(
            ComplaintStatus.RESOLVED,
            ComplaintStatus.IN_PROGRESS
        )
        .stream()
        .map(row -> new OfficerPerformanceResponse(
            ((Number) row[0]).longValue(),
            (String) row[1],
            ((Number) row[2]).longValue(),
            ((Number) row[3]).longValue(),
            ((Number) row[4]).longValue()
        ))
        .toList();
}

}