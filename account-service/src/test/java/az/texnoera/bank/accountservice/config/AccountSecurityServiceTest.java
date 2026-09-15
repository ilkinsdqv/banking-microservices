package az.texnoera.bank.accountservice.config;

import az.texnoera.bank.accountservice.account.entity.Account;
import az.texnoera.bank.accountservice.account.entity.AccountType;
import az.texnoera.bank.accountservice.account.entity.Currency;
import az.texnoera.bank.accountservice.account.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountSecurityServiceTest {

    @Mock
    private AccountRepository accountRepository;

    private AccountSecurityService service;

    @BeforeEach
    void setUp() {
        service = new AccountSecurityService(accountRepository);
    }

    @Test
    void shouldAllowOwnerWhenPrincipalIsUuid() {
        UUID userId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        when(accountRepository.findById(accountId))
                .thenReturn(Optional.of(account(userId)));

        assertThat(service.isOwner(
                new UsernamePasswordAuthenticationToken(userId, null),
                accountId
        )).isTrue();
    }

    @Test
    void shouldAllowCurrentUserWhenPrincipalIsUuidString() {
        UUID userId = UUID.randomUUID();

        assertThat(service.isCurrentUser(
                new UsernamePasswordAuthenticationToken(userId.toString(), null),
                userId
        )).isTrue();
    }

    @Test
    void shouldRejectNonOwnerAndMissingAccount() {
        UUID accountId = UUID.randomUUID();
        when(accountRepository.findById(accountId))
                .thenReturn(Optional.of(account(UUID.randomUUID())));

        assertThat(service.isOwner(
                new UsernamePasswordAuthenticationToken(UUID.randomUUID(), null),
                accountId
        )).isFalse();
        assertThat(service.isOwner(null, accountId)).isFalse();
    }

    private static Account account(UUID userId) {
        return new Account(
                userId,
                "AZ10NABZ12345678901234567890",
                BigDecimal.ZERO,
                Currency.AZN,
                AccountType.CHECKING
        );
    }
}
