package com.packt.CarDatabase.service;

import org.springframework.stereotype.Service;

import com.packt.CarDatabase.domain.RefreshToken;
import com.packt.CarDatabase.repository.RefreshTokenRepository;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class RefreshTokenService {

    private static final long REFRESH_TOKEN_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;
    private final RefreshTokenRepository repository;

    public RefreshTokenService(RefreshTokenRepository repository) {
        this.repository = repository;
    }

    /**
     * Create refresh token
     */
    public RefreshToken createRefreshToken(String username, String deviceId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(generateSecureToken());
        refreshToken.setUsername(username);
        refreshToken.setDeviceId(deviceId);
        refreshToken.setCreatedAt(Instant.now());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(REFRESH_TOKEN_EXPIRATION_SECONDS));
        refreshToken.setRevoked(false);

        return repository.save(refreshToken);
    }

    /**
     * Validate refresh token
     */
    public boolean validateRefreshToken(String token) {
        Optional<RefreshToken> optional = repository.findByToken(token);

        if (optional.isEmpty()) {
            return false;
        }

        RefreshToken refreshToken = optional.get();
        if (refreshToken.isRevoked()) {
            return false;
        }
        return refreshToken.getExpiryDate().isAfter(Instant.now());
    }

    /**
     * Find refresh token
     */
    public Optional<RefreshToken> findByToken(String token) {
        return repository.findByToken(token);
    }

    /**
     * Revoke one refresh token
     */
    @Transactional
    public void revokeRefreshToken(String token) {
        repository.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            repository.save(refreshToken);
        });
    }

    /**
     * Revoke all sessions for a user
     */
    @Transactional
    public void revokeAllUserTokens(String username) {
        List<RefreshToken> tokens = repository.findByUsername(username);
        for (RefreshToken token : tokens) {
            token.setRevoked(true);
            repository.save(token);
        }
    }

    /**
     * Rotate refresh token
     */
    @Transactional
    public RefreshToken rotateRefreshToken(String oldToken) {
        RefreshToken current = repository.findByToken(oldToken).orElseThrow(
                () -> new RuntimeException("Refresh token not found"));
        current.setRevoked(true);
        repository.save(current);
        return createRefreshToken(current.getUsername(), current.getDeviceId());
    }

    /**
     * Generate secure token
     */
    private String generateSecureToken() {
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);

        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
