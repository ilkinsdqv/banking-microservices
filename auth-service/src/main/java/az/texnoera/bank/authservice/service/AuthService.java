package az.texnoera.bank.authservice.service;

import az.texnoera.bank.authservice.dto.request.LoginRequest;
import az.texnoera.bank.authservice.dto.request.RefreshTokenRequest;
import az.texnoera.bank.authservice.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
}