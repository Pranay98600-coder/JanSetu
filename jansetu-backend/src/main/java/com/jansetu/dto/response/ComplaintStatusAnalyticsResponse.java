package com.jansetu.dto.response;

public record ComplaintStatusAnalyticsResponse(
        String status,
        long count
) {}