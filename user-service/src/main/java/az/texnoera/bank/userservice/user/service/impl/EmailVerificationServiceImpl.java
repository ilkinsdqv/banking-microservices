package az.texnoera.bank.userservice.user.service.impl;

import az.texnoera.bank.userservice.user.entity.EmailVerificationToken;
import az.texnoera.bank.userservice.user.entity.User;
import az.texnoera.bank.userservice.user.exception.EmailVerificationTokenExpiredException;
import az.texnoera.bank.userservice.user.exception.EmailVerificationTokenInvalidException;
import az.texnoera.bank.userservice.user.repository.EmailVerificationTokenRepository;
import az.texnoera.bank.userservice.user.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl
        implements EmailVerificationService {

    private static final int TOKEN_EXPIRATION_HOURS = 24;

    private final EmailVerificationTokenRepository tokenRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    @Override
    public String createVerificationToken(User user) {

        tokenRepository.deleteByUser(user);

        String token = generateToken();

        LocalDateTime expiresAt =
                LocalDateTime.now().plusHours(TOKEN_EXPIRATION_HOURS);

        EmailVerificationToken verificationToken =
                new EmailVerificationToken(
                        user,
                        token,
                        expiresAt
                );

        tokenRepository.save(verificationToken);

        return token;
    }

    @Transactional
    @Override
    public void verifyEmail(String token) {

        EmailVerificationToken verificationToken =
                tokenRepository.findByToken(token)
                        .orElseThrow(
                                EmailVerificationTokenInvalidException::new
                        );

        if (verificationToken.isExpired()) {
            throw new EmailVerificationTokenExpiredException();
        }

        if (verificationToken.isUsed()) {
            throw new EmailVerificationTokenInvalidException();
        }

        User user = verificationToken.getUser();

        user.verifyEmail();

        verificationToken.markAsUsed();
    }

    private String generateToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }
}