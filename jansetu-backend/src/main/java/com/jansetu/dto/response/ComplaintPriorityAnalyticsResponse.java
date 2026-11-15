package com.jansetu.dto.response;

public record ComplaintPriorityAnalyticsResponse(
        String priority,
        long count
) {}