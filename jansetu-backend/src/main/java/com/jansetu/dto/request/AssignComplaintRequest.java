package com.jansetu.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AssignComplaintRequest(

    @NotNull(message = "Officer ID is required")
    @Positive(message = "Officer ID must be positive")
    Long officerId

) {}