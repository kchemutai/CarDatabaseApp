package com.packt.CarDatabase.domain;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {
}
