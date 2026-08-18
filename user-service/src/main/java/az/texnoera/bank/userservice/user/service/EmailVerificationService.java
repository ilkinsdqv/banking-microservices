package az.texnoera.bank.userservice.user.service;

import az.texnoera.bank.userservice.user.entity.User;

public interface EmailVerificationService {

    String createVerificationToken(User user);

    void verifyEmail(String token);
}