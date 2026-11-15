package com.jansetu.dto.response;

public record DashboardSummaryResponse(

        long totalComplaints,

        long submitted,
        long underReview,
        long assigned,
        long inProgress,
        long resolved,
        long rejected,
        long reopened,
        long closed,

        long lowPriority,
        long mediumPriority,
        long highPriority,
        long criticalPriority

) {}