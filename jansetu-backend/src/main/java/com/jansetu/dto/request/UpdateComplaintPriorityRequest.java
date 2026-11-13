package com.jansetu.dto.request;

import com.jansetu.enums.ComplaintPriority;
import jakarta.validation.constraints.NotNull;

public record UpdateComplaintPriorityRequest(

    @NotNull(message = "Complaint priority is required")
    ComplaintPriority priority

) {}