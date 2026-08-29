package az.texnoera.bank.authservice.service;

import az.texnoera.bank.authservice.dto.request.LoginRequest;
import az.texnoera.bank.authservice.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}