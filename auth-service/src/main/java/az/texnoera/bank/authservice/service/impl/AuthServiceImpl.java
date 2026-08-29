package az.texnoera.bank.authservice.service.impl;

import az.texnoera.bank.authservice.client.UserClient;
import az.texnoera.bank.authservice.dto.request.LoginRequest;
import az.texnoera.bank.authservice.dto.response.LoginResponse;
import az.texnoera.bank.authservice.dto.response.UserAuthResponse;
import az.texnoera.bank.authservice.security.JwtProperties;
import az.texnoera.bank.authservice.security.JwtService;
import az.texnoera.bank.authservice.service.AuthService;
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

    @Override
    public LoginResponse login(LoginRequest request) {

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

        return new LoginResponse(
                accessToken,
                "Bearer",
                jwtProperties.getAccessTokenExpiration() / 1000
        );
    }
}