package com.jansetu.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOfficerRequest(

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    String fullName,

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must contain at least 8 characters")
    String password,

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain exactly 10 digits")
    String phone

) {}