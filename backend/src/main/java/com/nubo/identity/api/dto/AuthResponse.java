package com.nubo.identity.api.dto;

public record AuthResponse(
    String accessToken,
    String tokenType,
    long expiresInMinutes,
    UserResponse user
) {
}
