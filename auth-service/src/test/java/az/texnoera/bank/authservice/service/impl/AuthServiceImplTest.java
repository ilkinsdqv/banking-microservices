package az.texnoera.bank.authservice.service.impl;

import az.texnoera.bank.authservice.audit.AuditEventPublisher;
import az.texnoera.bank.authservice.client.UserClient;
import az.texnoera.bank.authservice.dto.request.LoginRequest;
import az.texnoera.bank.authservice.dto.request.RefreshTokenRequest;
import az.texnoera.bank.authservice.dto.response.LoginResponse;
import az.texnoera.bank.authservice.dto.response.UserAuthResponse;
import az.texnoera.bank.authservice.entity.RefreshToken;
import az.texnoera.bank.authservice.security.JwtProperties;
import az.texnoera.bank.authservice.security.JwtService;
import az.texnoera.bank.authservice.service.RefreshTokenService;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserClient userClient;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    private AuthServiceImpl service;

    @BeforeEach
    void setUp() {
        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setAccessTokenExpiration(900_000);
        service = new AuthServiceImpl(
                userClient,
                passwordEncoder,
                jwtService,
                jwtProperties,
                refreshTokenService,
                auditEventPublisher
        );
    }

    @Test
    void shouldLoginWhenCredentialsAndUserStateAreValid() {
        UUID userId = UUID.randomUUID();
        RefreshToken refreshToken = new RefreshToken(
                userId,
                "refresh-token",
                LocalDateTime.now().plusDays(30)
        );

        when(userClient.getUserForAuthentication("leyla@example.com"))
                .thenReturn(user(userId, true, false, true));
        when(passwordEncoder.matches("plain-password", "encoded-password"))
                .thenReturn(true);
        when(jwtService.generateAccessToken(userId, Set.of("CUSTOMER")))
                .thenReturn("access-token");
        when(refreshTokenService.createRefreshToken(userId))
                .thenReturn(refreshToken);

        LoginResponse response = service.login(
                new LoginRequest("leyla@example.com", "plain-password"),
                "10.0.0.5"
        );

        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.refreshToken()).isEqualTo("refresh-token");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.expiresIn()).isEqualTo(900);
        verify(auditEventPublisher).publish(
                userId,
                AuditAction.USER_LOGIN,
                "USER",
                userId,
                "User login successful",
                AuditStatus.SUCCESS,
                "10.0.0.5"
        );
    }

    @Test
    void shouldRejectLoginWhenPasswordDoesNotMatch() {
        when(userClient.getUserForAuthentication("leyla@example.com"))
                .thenReturn(user(UUID.randomUUID(), true, false, true));
        when(passwordEncoder.matches("wrong-password", "encoded-password"))
                .thenReturn(false);

        assertThatThrownBy(() -> service.login(
                new LoginRequest("leyla@example.com", "wrong-password"),
                "10.0.0.5"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid credentials");

        verifyNoInteractions(jwtService, refreshTokenService, auditEventPublisher);
    }

    @Test
    void shouldRejectLoginWhenUserIsDisabled() {
        when(userClient.getUserForAuthentication("leyla@example.com"))
                .thenReturn(user(UUID.randomUUID(), true, false, false));

        assertThatThrownBy(() -> service.login(
                new LoginRequest("leyla@example.com", "plain-password"),
                "10.0.0.5"
        )).isInstanceOf(IllegalStateException.class)
                .hasMessage("User account is disabled");
    }

    @Test
    void shouldRejectLoginWhenUserIsLocked() {
        when(userClient.getUserForAuthentication("leyla@example.com"))
                .thenReturn(user(UUID.randomUUID(), true, true, true));

        assertThatThrownBy(() -> service.login(
                new LoginRequest("leyla@example.com", "plain-password"),
                "10.0.0.5"
        )).isInstanceOf(IllegalStateException.class)
                .hasMessage("User account is locked");
    }

    @Test
    void shouldRejectLoginWhenEmailIsNotVerified() {
        when(userClient.getUserForAuthentication("leyla@example.com"))
                .thenReturn(user(UUID.randomUUID(), false, false, true));

        assertThatThrownBy(() -> service.login(
                new LoginRequest("leyla@example.com", "plain-password"),
                "10.0.0.5"
        )).isInstanceOf(IllegalStateException.class)
                .hasMessage("Email is not verified");
    }

    @Test
    void shouldRefreshAccessTokenWhenRefreshTokenIsValid() {
        UUID userId = UUID.randomUUID();
        RefreshToken refreshToken = new RefreshToken(
                userId,
                "refresh-token",
                LocalDateTime.now().plusDays(30)
        );

        when(refreshTokenService.validateRefreshToken("refresh-token"))
                .thenReturn(refreshToken);
        when(userClient.getUserForAuthenticationById(userId))
                .thenReturn(user(userId, true, false, true));
        when(jwtService.generateAccessToken(userId, Set.of("CUSTOMER")))
                .thenReturn("new-access-token");

        LoginResponse response = service.refreshToken(
                new RefreshTokenRequest("refresh-token")
        );

        assertThat(response.accessToken()).isEqualTo("new-access-token");
        assertThat(response.refreshToken()).isEqualTo("refresh-token");
        assertThat(response.expiresIn()).isEqualTo(900);
    }

    @Test
    void shouldRevokeRefreshTokenOnLogout() {
        service.logout("refresh-token");

        verify(refreshTokenService).revokeRefreshToken("refresh-token");
    }

    private static UserAuthResponse user(
            UUID userId,
            boolean emailVerified,
            boolean locked,
            boolean enabled
    ) {
        return new UserAuthResponse(
                userId,
                "leyla@example.com",
                "encoded-password",
                Set.of("CUSTOMER"),
                emailVerified,
                locked,
                enabled
        );
    }
}
