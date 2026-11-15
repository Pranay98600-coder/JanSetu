
package com.jansetu.dto.response;

public record OfficerPerformanceResponse(
    Long officerId,
    String officerName,
    long assignedComplaints,
    long resolvedComplaints,
    long inProgressComplaints
) {}
