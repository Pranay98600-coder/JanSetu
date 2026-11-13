package com.jansetu.dto.response;

import com.jansetu.entity.User;

import java.time.LocalDateTime;

public record OfficerResponse(
    Long id,
    String fullName,
    String email,
    String phone,
    String role,
    LocalDateTime createdAt
) {

    public static OfficerResponse from(User user) {
        return new OfficerResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole().name(),
            user.getCreatedAt()
        );
    }
}