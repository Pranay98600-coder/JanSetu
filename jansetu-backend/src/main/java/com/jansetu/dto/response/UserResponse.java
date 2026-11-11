package com.jansetu.dto.response;

import com.jansetu.entity.User;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role
) {

    public static UserResponse from(User user) {

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name()
        );
    }
}