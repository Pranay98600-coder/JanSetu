package com.jansetu.dto.response;

public record ComplaintCategoryAnalyticsResponse(
        String category,
        long count
) {}