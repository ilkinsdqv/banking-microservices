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
import az.texnoera.bank.authservice.service.AuthService;
import az.texnoera.bank.authservice.service.RefreshTokenService;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserClient userClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final RefreshTokenService refreshTokenService;
    private final AuditEventPublisher auditEventPublisher;

    @Override
    public LoginResponse login(
            LoginRequest request,
            String ipAddress
    ) {

        UserAuthResponse user =
                userClient.getUserForAuthentication(request.email());

        if (!user.enabled()) {
            throw new IllegalStateException("User account is disabled");
        }

        if (user.accountLocked()) {
            throw new IllegalStateException("User account is locked");
        }

        if (!user.emailVerified()) {
            throw new IllegalStateException("Email is not verified");
        }

        if (!passwordEncoder.matches(
                request.password(),
                user.password()
        )) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String accessToken = jwtService.generateAccessToken(
                user.id(),
                user.roles()
        );

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user.id());

        auditEventPublisher.publish(
                user.id(),
                AuditAction.USER_LOGIN,
                "USER",
                user.id(),
                "User login successful",
                AuditStatus.SUCCESS,
                ipAddress
        );

        return new LoginResponse(
                accessToken,
                refreshToken.getToken(),
                "Bearer",
                jwtProperties.getAccessTokenExpiration() / 1000
        );
    }

    @Override
    public LoginResponse refreshToken(RefreshTokenRequest request) {

        RefreshToken refreshToken =
                refreshTokenService.validateRefreshToken(
                        request.refreshToken()
                );

        UserAuthResponse user =
                userClient.getUserForAuthenticationById(
                        refreshToken.getUserId()
                );

        String accessToken = jwtService.generateAccessToken(
                user.id(),
                user.roles()
        );

        return new LoginResponse(
                accessToken,
                refreshToken.getToken(),
                "Bearer",
                jwtProperties.getAccessTokenExpiration() / 1000
        );
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenService.revokeRefreshToken(refreshToken);
    }
}