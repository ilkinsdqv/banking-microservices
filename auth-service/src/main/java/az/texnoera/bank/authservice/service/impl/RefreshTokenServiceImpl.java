package az.texnoera.bank.authservice.service.impl;

import az.texnoera.bank.authservice.entity.RefreshToken;
import az.texnoera.bank.authservice.repository.RefreshTokenRepository;
import az.texnoera.bank.authservice.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final long REFRESH_TOKEN_EXPIRATION_DAYS = 30;

    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(UUID userId) {

        refreshTokenRepository.deleteAllByUserId(userId);

        RefreshToken refreshToken = new RefreshToken(
                userId,
                UUID.randomUUID().toString(),
                LocalDateTime.now()
                        .plusDays(REFRESH_TOKEN_EXPIRATION_DAYS)
        );

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshToken validateRefreshToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid refresh token"
                        )
                );

        if (refreshToken.isExpired()) {
            throw new IllegalArgumentException(
                    "Refresh token has expired"
            );
        }

        if (refreshToken.isRevoked()) {
            throw new IllegalArgumentException(
                    "Refresh token has been revoked"
            );
        }

        return refreshToken;
    }

    @Override
    @Transactional
    public void revokeRefreshToken(String token) {

        RefreshToken refreshToken = validateRefreshToken(token);

        refreshToken.revoke();
    }
}