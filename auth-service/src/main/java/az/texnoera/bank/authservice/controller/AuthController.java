package az.texnoera.bank.authservice.controller;

import az.texnoera.bank.authservice.dto.request.LoginRequest;
import az.texnoera.bank.authservice.dto.request.RefreshTokenRequest;
import az.texnoera.bank.authservice.dto.response.LoginResponse;
import az.texnoera.bank.authservice.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            HttpServletRequest httpRequest,
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(
                request,
                getClientIpAddress(httpRequest)
        );
    }

    @PostMapping("/refresh")
    public LoginResponse refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        return authService.refreshToken(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        authService.logout(request.refreshToken());
    }

    private String getClientIpAddress(
            HttpServletRequest request
    ) {
        String forwardedFor =
                request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}