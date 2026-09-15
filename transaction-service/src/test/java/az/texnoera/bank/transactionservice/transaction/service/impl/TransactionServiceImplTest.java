package az.texnoera.bank.transactionservice.transaction.service.impl;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import az.texnoera.bank.transactionservice.audit.AuditEventPublisher;
import az.texnoera.bank.transactionservice.client.AccountServiceClient;
import az.texnoera.bank.transactionservice.client.dto.AccountResponse;
import az.texnoera.bank.transactionservice.transaction.dto.request.BalanceOperationRequest;
import az.texnoera.bank.transactionservice.transaction.dto.request.CreateTransactionRequest;
import az.texnoera.bank.transactionservice.transaction.dto.response.TransactionResponse;
import az.texnoera.bank.transactionservice.transaction.entity.Currency;
import az.texnoera.bank.transactionservice.transaction.entity.Transaction;
import az.texnoera.bank.transactionservice.transaction.entity.TransactionStatus;
import az.texnoera.bank.transactionservice.transaction.entity.TransactionType;
import az.texnoera.bank.transactionservice.transaction.exception.TransactionNotFoundException;
import az.texnoera.bank.transactionservice.transaction.mapper.TransactionMapper;
import az.texnoera.bank.transactionservice.transaction.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionMapper transactionMapper;

    @Mock
    private AccountServiceClient accountServiceClient;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    private TransactionServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new TransactionServiceImpl(
                transactionRepository,
                transactionMapper,
                accountServiceClient,
                auditEventPublisher
        );
    }

    @Test
    void shouldCreateDepositWhenAccountBelongsToUser() {
        UUID userId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        CreateTransactionRequest request = new CreateTransactionRequest(
                null,
                accountId,
                new BigDecimal("25.00"),
                Currency.AZN,
                TransactionType.DEPOSIT,
                "cash deposit"
        );

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account(accountId, userId, "AZN"));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionMapper.toResponse(any(Transaction.class)))
                .thenAnswer(invocation -> toResponse(invocation.getArgument(0)));

        TransactionResponse response =
                service.createTransaction(userId, request, "10.0.0.5");

        assertThat(response.type()).isEqualTo(TransactionType.DEPOSIT);
        assertThat(response.status()).isEqualTo(TransactionStatus.COMPLETED);
        assertThat(response.toAccountId()).isEqualTo(accountId);
        verify(accountServiceClient).deposit(
                eq(accountId),
                eq(new BalanceOperationRequest(new BigDecimal("25.00")))
        );
        verify(auditEventPublisher).publish(
                eq(userId),
                eq(AuditAction.MONEY_DEPOSITED),
                eq("TRANSACTION"),
                eq(null),
                eq("cash deposit"),
                eq(AuditStatus.SUCCESS),
                eq("10.0.0.5")
        );
    }

    @Test
    void shouldCreateWithdrawWhenAccountBelongsToUser() {
        UUID userId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        CreateTransactionRequest request = new CreateTransactionRequest(
                accountId,
                null,
                new BigDecimal("10.00"),
                Currency.AZN,
                TransactionType.WITHDRAW,
                null
        );

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account(accountId, userId, "AZN"));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionMapper.toResponse(any(Transaction.class)))
                .thenAnswer(invocation -> toResponse(invocation.getArgument(0)));

        TransactionResponse response =
                service.createTransaction(userId, request, "127.0.0.1");

        assertThat(response.type()).isEqualTo(TransactionType.WITHDRAW);
        assertThat(response.status()).isEqualTo(TransactionStatus.COMPLETED);
        verify(accountServiceClient).withdraw(
                eq(accountId),
                eq(new BalanceOperationRequest(new BigDecimal("10.00")))
        );
    }

    @Test
    void shouldCompleteTransferWhenWithdrawAndDepositSucceed() {
        UUID userId = UUID.randomUUID();
        UUID sourceId = UUID.randomUUID();
        UUID destinationId = UUID.randomUUID();
        CreateTransactionRequest request = transferRequest(sourceId, destinationId);

        when(accountServiceClient.getAccountById(sourceId))
                .thenReturn(account(sourceId, userId, "AZN"));
        when(accountServiceClient.getAccountById(destinationId))
                .thenReturn(account(destinationId, UUID.randomUUID(), "AZN"));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionMapper.toResponse(any(Transaction.class)))
                .thenAnswer(invocation -> toResponse(invocation.getArgument(0)));

        TransactionResponse response =
                service.createTransaction(userId, request, "10.0.0.5");

        assertThat(response.status()).isEqualTo(TransactionStatus.COMPLETED);
        assertThat(response.fromAccountId()).isEqualTo(sourceId);
        assertThat(response.toAccountId()).isEqualTo(destinationId);
        verify(auditEventPublisher).publish(
                eq(userId),
                eq(AuditAction.MONEY_TRANSFERRED),
                eq("TRANSACTION"),
                eq(null),
                eq("rent"),
                eq(AuditStatus.SUCCESS),
                eq("10.0.0.5")
        );
    }

    @Test
    void shouldFailTransferAndCompensateWhenDestinationDepositFails() {
        UUID userId = UUID.randomUUID();
        UUID sourceId = UUID.randomUUID();
        UUID destinationId = UUID.randomUUID();
        CreateTransactionRequest request = transferRequest(sourceId, destinationId);
        RuntimeException depositFailure = new RuntimeException("deposit failed");

        when(accountServiceClient.getAccountById(sourceId))
                .thenReturn(account(sourceId, userId, "AZN"));
        when(accountServiceClient.getAccountById(destinationId))
                .thenReturn(account(destinationId, UUID.randomUUID(), "AZN"));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(accountServiceClient.deposit(
                eq(destinationId),
                any(BalanceOperationRequest.class)
        )).thenThrow(depositFailure);

        assertThatThrownBy(() -> service.createTransaction(userId, request, "10.0.0.5"))
                .isSameAs(depositFailure);

        verify(accountServiceClient).deposit(
                eq(sourceId),
                eq(new BalanceOperationRequest(new BigDecimal("30.00")))
        );

        ArgumentCaptor<Transaction> captor =
                ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository, atLeastOnce()).save(captor.capture());
        assertThat(captor.getAllValues())
                .extracting(Transaction::getStatus)
                .contains(TransactionStatus.FAILED);
    }

    @Test
    void shouldRejectTransferWhenSourceAndDestinationAreSame() {
        UUID userId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account(accountId, userId, "AZN"));

        assertThatThrownBy(() -> service.createTransaction(
                userId,
                transferRequest(accountId, accountId),
                "127.0.0.1"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Source and destination accounts must be different");
    }

    @Test
    void shouldRejectTransactionWhenAccountIsNotOwnedByUser() {
        UUID accountId = UUID.randomUUID();
        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account(accountId, UUID.randomUUID(), "AZN"));

        assertThatThrownBy(() -> service.createTransaction(
                UUID.randomUUID(),
                new CreateTransactionRequest(
                        accountId,
                        null,
                        BigDecimal.ONE,
                        Currency.AZN,
                        TransactionType.WITHDRAW,
                        null
                ),
                "127.0.0.1"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Account does not belong to current user");
    }

    @Test
    void shouldRejectTransactionWhenCurrencyDoesNotMatchAccount() {
        UUID userId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account(accountId, userId, "USD"));

        assertThatThrownBy(() -> service.createTransaction(
                userId,
                new CreateTransactionRequest(
                        accountId,
                        null,
                        BigDecimal.ONE,
                        Currency.AZN,
                        TransactionType.WITHDRAW,
                        null
                ),
                "127.0.0.1"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Account currency does not match transaction currency");
    }

    @Test
    void shouldRejectInvalidTypeShape() {
        assertThatThrownBy(() -> service.createTransaction(
                UUID.randomUUID(),
                new CreateTransactionRequest(
                        UUID.randomUUID(),
                        UUID.randomUUID(),
                        BigDecimal.ONE,
                        Currency.AZN,
                        TransactionType.DEPOSIT,
                        null
                ),
                "127.0.0.1"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("DEPOSIT requires only toAccountId");
    }

    @Test
    void shouldRejectPublicLoanDisbursementTransactionType() {
        assertThatThrownBy(() -> service.createTransaction(
                UUID.randomUUID(),
                new CreateTransactionRequest(
                        null,
                        UUID.randomUUID(),
                        BigDecimal.ONE,
                        Currency.AZN,
                        TransactionType.LOAN_DISBURSEMENT,
                        null
                ),
                "127.0.0.1"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Loan disbursement must use internal endpoint");
    }

    @Test
    void shouldCreateLoanDisbursementThroughInternalFlow() {
        UUID userId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account(accountId, userId, "AZN"));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionMapper.toResponse(any(Transaction.class)))
                .thenAnswer(invocation -> toResponse(invocation.getArgument(0)));

        TransactionResponse response = service.createLoanDisbursement(
                userId,
                accountId,
                new BigDecimal("100.00"),
                Currency.AZN,
                "loan disbursement",
                "127.0.0.1"
        );

        assertThat(response.type()).isEqualTo(TransactionType.LOAN_DISBURSEMENT);
        assertThat(response.status()).isEqualTo(TransactionStatus.COMPLETED);
        verify(accountServiceClient).deposit(
                eq(accountId),
                eq(new BalanceOperationRequest(new BigDecimal("100.00")))
        );
    }

    @Test
    void shouldGetTransactionByIdAndAccountHistory() {
        UUID transactionId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        Transaction transaction = new Transaction(
                accountId,
                UUID.randomUUID(),
                BigDecimal.ONE,
                Currency.AZN,
                TransactionType.TRANSFER,
                TransactionStatus.COMPLETED,
                null
        );

        when(transactionRepository.findById(transactionId))
                .thenReturn(Optional.of(transaction));
        when(transactionRepository.findAllByAccountId(accountId))
                .thenReturn(List.of(transaction));
        when(transactionMapper.toResponse(transaction))
                .thenReturn(toResponse(transaction));

        assertThat(service.getTransactionById(transactionId).type())
                .isEqualTo(TransactionType.TRANSFER);
        assertThat(service.getTransactionsByAccountId(accountId))
                .hasSize(1);
    }

    @Test
    void shouldThrowWhenTransactionDoesNotExist() {
        UUID transactionId = UUID.randomUUID();
        when(transactionRepository.findById(transactionId))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getTransactionById(transactionId))
                .isInstanceOf(TransactionNotFoundException.class);
    }

    @Test
    void shouldNotPublishAuditWhenWithdrawClientFails() {
        UUID userId = UUID.randomUUID();
        UUID accountId = UUID.randomUUID();
        RuntimeException failure = new RuntimeException("withdraw failed");
        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account(accountId, userId, "AZN"));
        when(accountServiceClient.withdraw(
                eq(accountId),
                any(BalanceOperationRequest.class)
        )).thenThrow(failure);

        assertThatThrownBy(() -> service.createTransaction(
                userId,
                new CreateTransactionRequest(
                        accountId,
                        null,
                        BigDecimal.TEN,
                        Currency.AZN,
                        TransactionType.WITHDRAW,
                        null
                ),
                "127.0.0.1"
        )).isSameAs(failure);

        verify(auditEventPublisher, never()).publish(
                any(), any(), any(), any(), any(), any(), any()
        );
    }

    private static CreateTransactionRequest transferRequest(
            UUID sourceId,
            UUID destinationId
    ) {
        return new CreateTransactionRequest(
                sourceId,
                destinationId,
                new BigDecimal("30.00"),
                Currency.AZN,
                TransactionType.TRANSFER,
                "rent"
        );
    }

    private static AccountResponse account(
            UUID accountId,
            UUID userId,
            String currency
    ) {
        return new AccountResponse(
                accountId,
                userId,
                "AZ10NABZ12345678901234567890",
                BigDecimal.TEN,
                currency,
                "CHECKING",
                null,
                null
        );
    }

    private static TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                null,
                transaction.getFromAccountId(),
                transaction.getToAccountId(),
                transaction.getAmount(),
                transaction.getCurrency(),
                transaction.getType(),
                transaction.getStatus(),
                transaction.getDescription(),
                null,
                null
        );
    }
}
