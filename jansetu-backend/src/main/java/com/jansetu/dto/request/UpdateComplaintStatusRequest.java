package com.jansetu.dto.request;

import com.jansetu.enums.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateComplaintStatusRequest(

    @NotNull(message = "Complaint status is required")
    ComplaintStatus status

) {}