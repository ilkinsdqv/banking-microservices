package az.texnoera.bank.userservice.user.service.impl;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import az.texnoera.bank.userservice.audit.AuditEventPublisher;
import az.texnoera.bank.userservice.user.entity.EmailVerificationToken;
import az.texnoera.bank.userservice.user.entity.User;
import az.texnoera.bank.userservice.user.enums.Role;
import az.texnoera.bank.userservice.user.exception.EmailVerificationTokenExpiredException;
import az.texnoera.bank.userservice.user.exception.EmailVerificationTokenInvalidException;
import az.texnoera.bank.userservice.user.repository.EmailVerificationTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceImplTest {

    @Mock
    private EmailVerificationTokenRepository tokenRepository;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    private EmailVerificationServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new EmailVerificationServiceImpl(
                tokenRepository,
                auditEventPublisher
        );
    }

    @Test
    void shouldCreateVerificationTokenAndReplaceExistingToken() {
        User user = user();

        String token = service.createVerificationToken(user);

        assertThat(token).isNotBlank();
        verify(tokenRepository).deleteByUser(user);

        ArgumentCaptor<EmailVerificationToken> captor =
                ArgumentCaptor.forClass(EmailVerificationToken.class);
        verify(tokenRepository).save(captor.capture());
        assertThat(captor.getValue().getUser()).isEqualTo(user);
        assertThat(captor.getValue().getToken()).isEqualTo(token);
        assertThat(captor.getValue().getExpiresAt()).isAfter(LocalDateTime.now());
    }

    @Test
    void shouldVerifyEmailWhenTokenIsValid() {
        User user = user();
        EmailVerificationToken token = new EmailVerificationToken(
                user,
                "valid-token",
                LocalDateTime.now().plusHours(1)
        );
        when(tokenRepository.findByToken("valid-token"))
                .thenReturn(Optional.of(token));

        service.verifyEmail("valid-token", "127.0.0.1");

        assertThat(user.isEmailVerified()).isTrue();
        assertThat(token.isUsed()).isTrue();
        verify(auditEventPublisher).publish(
                eq(null),
                eq(AuditAction.USER_EMAIL_VERIFIED),
                eq("USER"),
                eq(null),
                eq("Email verified for user: null"),
                eq(AuditStatus.SUCCESS),
                eq("127.0.0.1")
        );
    }

    @Test
    void shouldRejectUnknownVerificationToken() {
        when(tokenRepository.findByToken("missing"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.verifyEmail("missing", "127.0.0.1"))
                .isInstanceOf(EmailVerificationTokenInvalidException.class);
    }

    @Test
    void shouldRejectExpiredVerificationToken() {
        EmailVerificationToken token = new EmailVerificationToken(
                user(),
                "expired-token",
                LocalDateTime.now().minusSeconds(1)
        );
        when(tokenRepository.findByToken("expired-token"))
                .thenReturn(Optional.of(token));

        assertThatThrownBy(() -> service.verifyEmail("expired-token", "127.0.0.1"))
                .isInstanceOf(EmailVerificationTokenExpiredException.class);
    }

    @Test
    void shouldRejectUsedVerificationToken() {
        EmailVerificationToken token = new EmailVerificationToken(
                user(),
                "used-token",
                LocalDateTime.now().plusHours(1)
        );
        token.markAsUsed();
        when(tokenRepository.findByToken("used-token"))
                .thenReturn(Optional.of(token));

        assertThatThrownBy(() -> service.verifyEmail("used-token", "127.0.0.1"))
                .isInstanceOf(EmailVerificationTokenInvalidException.class);
    }

    private static User user() {
        return new User(
                "Leyla",
                "Aliyeva",
                "leyla@example.com",
                "encoded-current",
                Set.of(Role.CUSTOMER),
                "ABC1234",
                "+994501234567",
                LocalDate.of(1995, 1, 10)
        );
    }
}
