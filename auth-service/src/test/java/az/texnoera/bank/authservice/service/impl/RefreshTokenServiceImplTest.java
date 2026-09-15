package az.texnoera.bank.authservice.service.impl;

import az.texnoera.bank.authservice.entity.RefreshToken;
import az.texnoera.bank.authservice.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceImplTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    private RefreshTokenServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new RefreshTokenServiceImpl(refreshTokenRepository);
    }

    @Test
    void shouldCreateRefreshTokenAndDeleteExistingUserTokens() {
        UUID userId = UUID.randomUUID();
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RefreshToken refreshToken = service.createRefreshToken(userId);

        verify(refreshTokenRepository).deleteAllByUserId(userId);
        assertThat(refreshToken.getUserId()).isEqualTo(userId);
        assertThat(refreshToken.getToken()).isNotBlank();
        assertThat(refreshToken.getExpiresAt())
                .isAfter(LocalDateTime.now().plusDays(29));
    }

    @Test
    void shouldValidateActiveRefreshToken() {
        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID(),
                "refresh-token",
                LocalDateTime.now().plusDays(1)
        );
        when(refreshTokenRepository.findByToken("refresh-token"))
                .thenReturn(Optional.of(refreshToken));

        assertThat(service.validateRefreshToken("refresh-token"))
                .isSameAs(refreshToken);
    }

    @Test
    void shouldRejectMissingRefreshToken() {
        when(refreshTokenRepository.findByToken("missing"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validateRefreshToken("missing"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid refresh token");
    }

    @Test
    void shouldRejectExpiredRefreshToken() {
        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID(),
                "expired-token",
                LocalDateTime.now().minusSeconds(1)
        );
        when(refreshTokenRepository.findByToken("expired-token"))
                .thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() -> service.validateRefreshToken("expired-token"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Refresh token has expired");
    }

    @Test
    void shouldRejectRevokedRefreshToken() {
        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID(),
                "revoked-token",
                LocalDateTime.now().plusDays(1)
        );
        refreshToken.revoke();
        when(refreshTokenRepository.findByToken("revoked-token"))
                .thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() -> service.validateRefreshToken("revoked-token"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Refresh token has been revoked");
    }

    @Test
    void shouldRevokeRefreshToken() {
        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID(),
                "refresh-token",
                LocalDateTime.now().plusDays(1)
        );
        when(refreshTokenRepository.findByToken("refresh-token"))
                .thenReturn(Optional.of(refreshToken));

        service.revokeRefreshToken("refresh-token");

        assertThat(refreshToken.isRevoked()).isTrue();
    }
}
