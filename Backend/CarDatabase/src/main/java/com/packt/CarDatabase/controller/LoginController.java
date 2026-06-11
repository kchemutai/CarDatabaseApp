package com.packt.CarDatabase.controller;

import com.packt.CarDatabase.domain.AccountCredentials;
import com.packt.CarDatabase.domain.AuthResponse;
import com.packt.CarDatabase.domain.RefreshToken;
import com.packt.CarDatabase.domain.RefreshTokenRequest;
import com.packt.CarDatabase.service.JwtService;
import com.packt.CarDatabase.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    public LoginController(
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            RefreshTokenService refreshTokenService) {

        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<AuthResponse> getToken(
            @RequestBody AccountCredentials credentials) {

        UsernamePasswordAuthenticationToken creds =
                new UsernamePasswordAuthenticationToken(
                        credentials.username(),
                        credentials.password());

        Authentication auth =
                authenticationManager.authenticate(creds);

        String accessToken =
                jwtService.generateAccessToken(
                        auth.getName());

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(
                        auth.getName(),
                        "web");

        return ResponseEntity.ok(
                new AuthResponse(
                        accessToken,
                        refreshToken.getToken()));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestBody RefreshTokenRequest request) {

        if (!refreshTokenService.validateRefreshToken(
                request.refreshToken())) {

            return ResponseEntity
                    .status(401)
                    .build();
        }

        RefreshToken current =
                refreshTokenService
                        .findByToken(
                                request.refreshToken())
                        .orElseThrow();

        String accessToken =
                jwtService.generateAccessToken(
                        current.getUsername());

        RefreshToken newRefreshToken =
                refreshTokenService.rotateRefreshToken(
                        request.refreshToken());

        return ResponseEntity.ok(
                new AuthResponse(
                        accessToken,
                        newRefreshToken.getToken()));
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestBody RefreshTokenRequest request) {

        refreshTokenService.revokeRefreshToken(
                request.refreshToken());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll(
            Authentication authentication) {

        refreshTokenService.revokeAllUserTokens(
                authentication.getName());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/me")
    public ResponseEntity<String> me(
            Authentication authentication) {

        return ResponseEntity.ok(
                authentication.getName());
    }
}
