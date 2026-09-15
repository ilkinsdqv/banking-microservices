package az.texnoera.bank.accountservice.account.service.impl;

import az.texnoera.bank.accountservice.account.dto.request.CreateAccountRequest;
import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;
import az.texnoera.bank.accountservice.account.entity.Account;
import az.texnoera.bank.accountservice.account.entity.AccountType;
import az.texnoera.bank.accountservice.account.entity.Currency;
import az.texnoera.bank.accountservice.account.exception.AccountNotFoundException;
import az.texnoera.bank.accountservice.account.mapper.AccountMapper;
import az.texnoera.bank.accountservice.account.repository.AccountRepository;
import az.texnoera.bank.accountservice.account.service.IbanGenerator;
import az.texnoera.bank.accountservice.audit.AuditEventPublisher;
import az.texnoera.bank.accountservice.client.UserServiceClient;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private IbanGenerator ibanGenerator;

    @Mock
    private UserServiceClient userServiceClient;

    private AccountServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new AccountServiceImpl(
                accountRepository,
                auditEventPublisher,
                accountMapper,
                ibanGenerator,
                userServiceClient
        );
    }

    @Test
    void shouldCreateAccountWhenUserExists() {
        UUID userId = UUID.randomUUID();
        CreateAccountRequest request =
                new CreateAccountRequest(Currency.AZN, AccountType.CHECKING);
        AccountResponse response = response(userId, "AZ10NABZ12345678901234567890", BigDecimal.ZERO);

        when(userServiceClient.userExists(userId)).thenReturn(true);
        when(ibanGenerator.generate()).thenReturn(response.iban());
        when(accountRepository.existsByIban(response.iban())).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accountMapper.toResponse(any(Account.class))).thenReturn(response);

        AccountResponse result = service.createAccount(userId, request, "10.0.0.5");

        assertThat(result).isEqualTo(response);
        verify(accountRepository).save(any(Account.class));
        verify(auditEventPublisher).publish(
                eq(userId),
                eq(AuditAction.ACCOUNT_CREATED),
                eq("ACCOUNT"),
                eq(null),
                eq("Account created: " + response.iban()),
                eq(AuditStatus.SUCCESS),
                eq("10.0.0.5")
        );
    }

    @Test
    void shouldGenerateAnotherIbanWhenCollisionOccurs() {
        UUID userId = UUID.randomUUID();
        String duplicate = "AZ10NABZ11111111111111111111";
        String unique = "AZ20NABZ22222222222222222222";

        when(userServiceClient.userExists(userId)).thenReturn(true);
        when(ibanGenerator.generate()).thenReturn(duplicate, unique);
        when(accountRepository.existsByIban(duplicate)).thenReturn(true);
        when(accountRepository.existsByIban(unique)).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accountMapper.toResponse(any(Account.class))).thenReturn(
                response(userId, unique, BigDecimal.ZERO)
        );

        AccountResponse result = service.createAccount(
                userId,
                new CreateAccountRequest(Currency.USD, AccountType.SAVINGS),
                "127.0.0.1"
        );

        assertThat(result.iban()).isEqualTo(unique);
        verify(accountRepository).existsByIban(duplicate);
        verify(accountRepository).existsByIban(unique);
    }

    @Test
    void shouldRejectAccountCreationWhenUserDoesNotExist() {
        UUID userId = UUID.randomUUID();
        when(userServiceClient.userExists(userId)).thenReturn(false);

        assertThatThrownBy(() -> service.createAccount(
                userId,
                new CreateAccountRequest(Currency.AZN, AccountType.CHECKING),
                "127.0.0.1"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found with id: " + userId);

        verify(accountRepository, never()).save(any());
    }

    @Test
    void shouldReturnAccountById() {
        UUID accountId = UUID.randomUUID();
        Account account = account(UUID.randomUUID(), new BigDecimal("25.00"));
        AccountResponse response =
                response(account.getUserId(), account.getIban(), account.getBalance());

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountMapper.toResponse(account)).thenReturn(response);

        assertThat(service.getAccountById(accountId)).isEqualTo(response);
    }

    @Test
    void shouldThrowWhenAccountDoesNotExist() {
        UUID accountId = UUID.randomUUID();
        when(accountRepository.findById(accountId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getAccountById(accountId))
                .isInstanceOf(AccountNotFoundException.class);
    }

    @Test
    void shouldReturnAccountsByUserId() {
        UUID userId = UUID.randomUUID();
        Account first = account(userId, BigDecimal.ONE);
        Account second = account(userId, BigDecimal.TEN);

        when(accountRepository.findAllByUserId(userId))
                .thenReturn(List.of(first, second));
        when(accountMapper.toResponse(any(Account.class)))
                .thenAnswer(invocation -> {
                    Account account = invocation.getArgument(0);
                    return response(account.getUserId(), account.getIban(), account.getBalance());
                });

        assertThat(service.getAccountsByUserId(userId))
                .extracting(AccountResponse::balance)
                .containsExactly(BigDecimal.ONE, BigDecimal.TEN);
    }

    @Test
    void shouldDepositPositiveAmountAndPublishAuditEvent() {
        UUID accountId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        Account account = account(userId, new BigDecimal("10.00"));
        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountMapper.toResponse(account)).thenAnswer(invocation ->
                response(userId, account.getIban(), account.getBalance()));

        AccountResponse response = service.deposit(
                accountId,
                new BigDecimal("15.50"),
                "10.0.0.5"
        );

        assertThat(response.balance()).isEqualByComparingTo("25.50");
        verify(auditEventPublisher).publish(
                eq(userId),
                eq(AuditAction.MONEY_DEPOSITED),
                eq("ACCOUNT"),
                eq(null),
                eq("Money deposited"),
                eq(AuditStatus.SUCCESS),
                eq("10.0.0.5")
        );
    }

    @Test
    void shouldWithdrawWhenBalanceIsSufficient() {
        UUID accountId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        Account account = account(userId, new BigDecimal("20.00"));
        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountMapper.toResponse(account)).thenAnswer(invocation ->
                response(userId, account.getIban(), account.getBalance()));

        AccountResponse response = service.withdraw(
                accountId,
                new BigDecimal("7.25"),
                "10.0.0.5"
        );

        assertThat(response.balance()).isEqualByComparingTo("12.75");
        verify(auditEventPublisher).publish(
                eq(userId),
                eq(AuditAction.MONEY_WITHDRAWN),
                eq("ACCOUNT"),
                eq(null),
                eq("Money withdrawn"),
                eq(AuditStatus.SUCCESS),
                eq("10.0.0.5")
        );
    }

    @Test
    void shouldRejectWithdrawWhenBalanceIsInsufficient() {
        UUID accountId = UUID.randomUUID();
        Account account = account(UUID.randomUUID(), new BigDecimal("5.00"));
        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

        assertThatThrownBy(() -> service.withdraw(
                accountId,
                new BigDecimal("6.00"),
                "127.0.0.1"
        )).isInstanceOf(IllegalStateException.class)
                .hasMessage("Insufficient account balance");

        verify(auditEventPublisher, never()).publish(
                any(), any(), any(), any(), any(), any(), any()
        );
    }

    @Test
    void shouldRejectZeroAndNegativeBalanceOperations() {
        Account account = account(UUID.randomUUID(), BigDecimal.TEN);

        assertThatThrownBy(() -> account.deposit(BigDecimal.ZERO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Amount must be greater than zero");
        assertThatThrownBy(() -> account.withdraw(new BigDecimal("-1.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Amount must be greater than zero");
    }

    private static Account account(UUID userId, BigDecimal balance) {
        return new Account(
                userId,
                "AZ10NABZ12345678901234567890",
                balance,
                Currency.AZN,
                AccountType.CHECKING
        );
    }

    private static AccountResponse response(
            UUID userId,
            String iban,
            BigDecimal balance
    ) {
        return new AccountResponse(
                null,
                userId,
                iban,
                balance,
                Currency.AZN,
                AccountType.CHECKING,
                null,
                null
        );
    }
}
