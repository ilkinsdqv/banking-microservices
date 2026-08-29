package az.texnoera.bank.authservice.service;

import az.texnoera.bank.authservice.entity.RefreshToken;

import java.util.UUID;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(UUID userId);

    RefreshToken validateRefreshToken(String token);

    void revokeRefreshToken(String token);
}