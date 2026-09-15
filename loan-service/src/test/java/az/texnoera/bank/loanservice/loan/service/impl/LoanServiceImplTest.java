package az.texnoera.bank.loanservice.loan.service.impl;

import az.texnoera.bank.loanservice.audit.AuditEventPublisher;
import az.texnoera.bank.loanservice.client.AccountServiceClient;
import az.texnoera.bank.loanservice.client.TransactionServiceClient;
import az.texnoera.bank.loanservice.client.dto.AccountResponse;
import az.texnoera.bank.loanservice.client.dto.TransactionResponse;
import az.texnoera.bank.loanservice.loan.dto.request.CreateLoanRequest;
import az.texnoera.bank.loanservice.loan.dto.response.LoanPaymentResponse;
import az.texnoera.bank.loanservice.loan.dto.response.LoanResponse;
import az.texnoera.bank.loanservice.loan.entity.Currency;
import az.texnoera.bank.loanservice.loan.entity.Loan;
import az.texnoera.bank.loanservice.loan.entity.LoanPayment;
import az.texnoera.bank.loanservice.loan.entity.LoanPaymentStatus;
import az.texnoera.bank.loanservice.loan.entity.LoanStatus;
import az.texnoera.bank.loanservice.loan.exception.LoanNotFoundException;
import az.texnoera.bank.loanservice.loan.mapper.LoanMapper;
import az.texnoera.bank.loanservice.loan.mapper.LoanPaymentMapper;
import az.texnoera.bank.loanservice.loan.repository.LoanPaymentRepository;
import az.texnoera.bank.loanservice.loan.repository.LoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanServiceImplTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private LoanMapper loanMapper;

    @Mock
    private LoanPaymentRepository loanPaymentRepository;

    @Mock
    private LoanPaymentMapper loanPaymentMapper;

    @Mock
    private TransactionServiceClient transactionServiceClient;

    @Mock
    private AccountServiceClient accountServiceClient;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    private LoanServiceImpl loanService;

    private UUID userId;
    private UUID accountId;
    private UUID loanId;

    private AccountResponse account;
    private CreateLoanRequest createLoanRequest;

    @BeforeEach
    void setUp() {

        loanService = new LoanServiceImpl(
                loanRepository,
                loanMapper,
                loanPaymentRepository,
                loanPaymentMapper,
                transactionServiceClient,
                accountServiceClient,
                auditEventPublisher
        );

        userId = UUID.randomUUID();
        accountId = UUID.randomUUID();
        loanId = UUID.randomUUID();

        account = new AccountResponse(
                accountId,
                userId,
                "AZ00BANK00000000000000000000",
                new BigDecimal("5000.00"),
                Currency.AZN.name(),
                "CURRENT",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        createLoanRequest = new CreateLoanRequest(
                accountId,
                new BigDecimal("10000.00"),
                new BigDecimal("12.00"),
                12,
                Currency.AZN
        );
    }

    @Test
    void createLoan_success() {

        Loan savedLoan = new Loan(
                userId,
                accountId,
                new BigDecimal("10000.00"),
                new BigDecimal("12.00"),
                12,
                new BigDecimal("888.4879"),
                new BigDecimal("10000.00"),
                Currency.AZN,
                LoanStatus.PENDING
        );

        LoanResponse expectedResponse = mock(LoanResponse.class);

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account);

        when(loanRepository.save(any(Loan.class)))
                .thenReturn(savedLoan);

        when(loanMapper.toResponse(savedLoan))
                .thenReturn(expectedResponse);

        LoanResponse result = loanService.createLoan(
                userId,
                createLoanRequest,
                "127.0.0.1"
        );

        assertSame(expectedResponse, result);

        ArgumentCaptor<Loan> loanCaptor =
                ArgumentCaptor.forClass(Loan.class);

        verify(loanRepository).save(loanCaptor.capture());

        Loan createdLoan = loanCaptor.getValue();

        assertEquals(userId, createdLoan.getUserId());
        assertEquals(accountId, createdLoan.getAccountId());
        assertEquals(
                new BigDecimal("10000.00"),
                createdLoan.getPrincipalAmount()
        );
        assertEquals(
                new BigDecimal("12.00"),
                createdLoan.getInterestRate()
        );
        assertEquals(12, createdLoan.getTermMonths());
        assertEquals(
                new BigDecimal("10000.00"),
                createdLoan.getRemainingAmount()
        );
        assertEquals(Currency.AZN, createdLoan.getCurrency());
        assertEquals(LoanStatus.PENDING, createdLoan.getStatus());

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("LOAN"),
                any(),
                contains("Loan created"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void createLoan_accountDoesNotBelongToUser() {

        UUID differentUserId = UUID.randomUUID();

        AccountResponse foreignAccount = new AccountResponse(
                accountId,
                differentUserId,
                "AZ00BANK00000000000000000000",
                new BigDecimal("5000.00"),
                Currency.AZN.name(),
                "CURRENT",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(foreignAccount);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loanService.createLoan(
                                userId,
                                createLoanRequest,
                                "127.0.0.1"
                        )
                );

        assertEquals(
                "Account does not belong to current user",
                exception.getMessage()
        );

        verify(loanRepository, never()).save(any());
        verify(auditEventPublisher, never()).publish(
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    void createLoan_currencyMismatch() {

        AccountResponse usdAccount = new AccountResponse(
                accountId,
                userId,
                "AZ00BANK00000000000000000000",
                new BigDecimal("5000.00"),
                "USD",
                "CURRENT",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(usdAccount);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loanService.createLoan(
                                userId,
                                createLoanRequest,
                                "127.0.0.1"
                        )
                );

        assertEquals(
                "Account currency does not match loan currency",
                exception.getMessage()
        );

        verify(loanRepository, never()).save(any());
    }

    @Test
    void createLoan_zeroInterestRate_calculatesMonthlyPayment() {

        CreateLoanRequest request = new CreateLoanRequest(
                accountId,
                new BigDecimal("12000.00"),
                BigDecimal.ZERO,
                12,
                Currency.AZN
        );

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account);

        Loan savedLoan = new Loan(
                userId,
                accountId,
                request.principalAmount(),
                request.interestRate(),
                request.termMonths(),
                new BigDecimal("1000.0000"),
                request.principalAmount(),
                Currency.AZN,
                LoanStatus.PENDING
        );

        when(loanRepository.save(any(Loan.class)))
                .thenReturn(savedLoan);

        when(loanMapper.toResponse(savedLoan))
                .thenReturn(mock(LoanResponse.class));

        loanService.createLoan(
                userId,
                request,
                "127.0.0.1"
        );

        ArgumentCaptor<Loan> captor =
                ArgumentCaptor.forClass(Loan.class);

        verify(loanRepository).save(captor.capture());

        assertEquals(
                new BigDecimal("1000.0000"),
                captor.getValue().getMonthlyPayment()
        );
    }

    @Test
    void getLoanById_success() {

        Loan loan = createLoan(LoanStatus.PENDING);
        LoanResponse response = mock(LoanResponse.class);

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(loanMapper.toResponse(loan))
                .thenReturn(response);

        LoanResponse result =
                loanService.getLoanById(loanId);

        assertSame(response, result);

        verify(loanRepository).findById(loanId);
        verify(loanMapper).toResponse(loan);
    }

    @Test
    void getLoanById_notFound() {

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.empty());

        assertThrows(
                LoanNotFoundException.class,
                () -> loanService.getLoanById(loanId)
        );

        verify(loanMapper, never()).toResponse(any());
    }

    @Test
    void getLoansByUserId_success() {

        Loan loan1 = createLoan(LoanStatus.PENDING);
        Loan loan2 = createLoan(LoanStatus.APPROVED);

        LoanResponse response1 = mock(LoanResponse.class);
        LoanResponse response2 = mock(LoanResponse.class);

        when(loanRepository.findAllByUserId(userId))
                .thenReturn(List.of(loan1, loan2));

        when(loanMapper.toResponse(loan1))
                .thenReturn(response1);

        when(loanMapper.toResponse(loan2))
                .thenReturn(response2);

        List<LoanResponse> result =
                loanService.getLoansByUserId(userId);

        assertEquals(
                List.of(response1, response2),
                result
        );

        verify(loanRepository).findAllByUserId(userId);
    }

    @Test
    void getLoansByAccountId_success() {

        Loan loan1 = createLoan(LoanStatus.PENDING);
        Loan loan2 = createLoan(LoanStatus.ACTIVE);

        LoanResponse response1 = mock(LoanResponse.class);
        LoanResponse response2 = mock(LoanResponse.class);

        when(loanRepository.findAllByAccountId(accountId))
                .thenReturn(List.of(loan1, loan2));

        when(loanMapper.toResponse(loan1))
                .thenReturn(response1);

        when(loanMapper.toResponse(loan2))
                .thenReturn(response2);

        List<LoanResponse> result =
                loanService.getLoansByAccountId(accountId);

        assertEquals(
                List.of(response1, response2),
                result
        );
    }

    @Test
    void approveLoan_success() {

        Loan loan = createLoan(LoanStatus.PENDING);
        LoanResponse response = mock(LoanResponse.class);

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(loanMapper.toResponse(loan))
                .thenReturn(response);

        LoanResponse result =
                loanService.approveLoan(
                        loanId,
                        "127.0.0.1"
                );

        assertSame(response, result);
        assertEquals(LoanStatus.APPROVED, loan.getStatus());

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("LOAN"),
                any(),
                contains("Loan approved"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void rejectLoan_success() {

        Loan loan = createLoan(LoanStatus.PENDING);
        LoanResponse response = mock(LoanResponse.class);

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(loanMapper.toResponse(loan))
                .thenReturn(response);

        LoanResponse result =
                loanService.rejectLoan(
                        loanId,
                        "127.0.0.1"
                );

        assertSame(response, result);
        assertEquals(LoanStatus.REJECTED, loan.getStatus());

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("LOAN"),
                any(),
                contains("Loan rejected"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void activateLoan_success() {

        Loan loan = createLoan(LoanStatus.APPROVED);
        LoanResponse response = mock(LoanResponse.class);

        TransactionResponse transaction =
                new TransactionResponse(
                        UUID.randomUUID(),
                        null,
                        accountId,
                        new BigDecimal("10000.00"),
                        Currency.AZN.name(),
                        "LOAN_DISBURSEMENT",
                        "COMPLETED",
                        "Loan disbursement",
                        LocalDateTime.now(),
                        LocalDateTime.now()
                );

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account);

        when(transactionServiceClient.createLoanDisbursement(any()))
                .thenReturn(transaction);

        when(loanMapper.toResponse(loan))
                .thenReturn(response);

        LoanResponse result =
                loanService.activateLoan(
                        loanId,
                        "127.0.0.1"
                );

        assertSame(response, result);
        assertEquals(LoanStatus.ACTIVE, loan.getStatus());

        verify(transactionServiceClient)
                .createLoanDisbursement(any());

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("LOAN"),
                any(),
                contains("Loan activated"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void activateLoan_transactionNotCompleted() {

        Loan loan = createLoan(LoanStatus.APPROVED);

        TransactionResponse transaction =
                new TransactionResponse(
                        UUID.randomUUID(),
                        null,
                        accountId,
                        new BigDecimal("10000.00"),
                        Currency.AZN.name(),
                        "LOAN_DISBURSEMENT",
                        "FAILED",
                        "Loan disbursement",
                        LocalDateTime.now(),
                        LocalDateTime.now()
                );

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(account);

        when(transactionServiceClient.createLoanDisbursement(any()))
                .thenReturn(transaction);

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        () -> loanService.activateLoan(
                                loanId,
                                "127.0.0.1"
                        )
                );

        assertEquals(
                "Loan disbursement transaction failed",
                exception.getMessage()
        );

        assertEquals(
                LoanStatus.APPROVED,
                loan.getStatus()
        );

        verify(auditEventPublisher, never()).publish(
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    void activateLoan_currencyMismatch() {

        Loan loan = createLoan(LoanStatus.APPROVED);

        AccountResponse usdAccount = new AccountResponse(
                accountId,
                userId,
                "AZ00BANK00000000000000000000",
                new BigDecimal("5000.00"),
                "USD",
                "CURRENT",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(accountServiceClient.getAccountById(accountId))
                .thenReturn(usdAccount);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loanService.activateLoan(
                                loanId,
                                "127.0.0.1"
                        )
                );

        assertEquals(
                "Account currency does not match loan currency",
                exception.getMessage()
        );

        verify(
                transactionServiceClient,
                never()
        ).createLoanDisbursement(any());
    }

    @Test
    void cancelLoan_success() {

        Loan loan = createLoan(LoanStatus.PENDING);
        LoanResponse response = mock(LoanResponse.class);

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(loanMapper.toResponse(loan))
                .thenReturn(response);

        LoanResponse result =
                loanService.cancelLoan(
                        loanId,
                        "127.0.0.1"
                );

        assertSame(response, result);
        assertEquals(LoanStatus.CANCELLED, loan.getStatus());

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("LOAN"),
                any(),
                contains("Loan cancelled"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void makePayment_success() {

        Loan loan = createLoan(LoanStatus.ACTIVE);
        LoanResponse response = mock(LoanResponse.class);

        BigDecimal paymentAmount =
                new BigDecimal("1000.00");

        TransactionResponse transaction =
                new TransactionResponse(
                        UUID.randomUUID(),
                        accountId,
                        null,
                        paymentAmount,
                        Currency.AZN.name(),
                        "LOAN_PAYMENT",
                        "COMPLETED",
                        "Loan payment",
                        LocalDateTime.now(),
                        LocalDateTime.now()
                );

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(transactionServiceClient.createLoanPayment(any()))
                .thenReturn(transaction);

        when(loanMapper.toResponse(loan))
                .thenReturn(response);

        LoanResponse result =
                loanService.makePayment(
                        loanId,
                        paymentAmount,
                        "127.0.0.1"
                );

        assertSame(response, result);

        assertEquals(
                new BigDecimal("9000.00"),
                loan.getRemainingAmount()
        );

        assertEquals(
                LoanStatus.ACTIVE,
                loan.getStatus()
        );

        verify(loanPaymentRepository).save(any(LoanPayment.class));

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("LOAN"),
                any(),
                contains("Loan payment"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void makePayment_fullRemainingAmount_marksLoanAsPaid() {

        Loan loan = createLoan(LoanStatus.ACTIVE);
        LoanResponse response = mock(LoanResponse.class);

        BigDecimal paymentAmount =
                new BigDecimal("10000.00");

        TransactionResponse transaction =
                new TransactionResponse(
                        UUID.randomUUID(),
                        accountId,
                        null,
                        paymentAmount,
                        Currency.AZN.name(),
                        "LOAN_PAYMENT",
                        "COMPLETED",
                        "Loan payment",
                        LocalDateTime.now(),
                        LocalDateTime.now()
                );

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(transactionServiceClient.createLoanPayment(any()))
                .thenReturn(transaction);

        when(loanMapper.toResponse(loan))
                .thenReturn(response);

        loanService.makePayment(
                loanId,
                paymentAmount,
                "127.0.0.1"
        );

        assertEquals(
                0,
                loan.getRemainingAmount().compareTo(BigDecimal.ZERO)
        );

        assertEquals(
                LoanStatus.PAID,
                loan.getStatus()
        );

        ArgumentCaptor<LoanPayment> captor =
                ArgumentCaptor.forClass(LoanPayment.class);

        verify(loanPaymentRepository)
                .save(captor.capture());

        LoanPayment payment =
                captor.getValue();

        assertEquals(
                paymentAmount,
                payment.getAmount()
        );

        assertEquals(
                0,
                loan.getRemainingAmount().compareTo(BigDecimal.ZERO)
        );

        assertEquals(
                LoanPaymentStatus.COMPLETED,
                payment.getStatus()
        );
    }

    @Test
    void makePayment_transactionNotCompleted() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        TransactionResponse transaction =
                new TransactionResponse(
                        UUID.randomUUID(),
                        accountId,
                        null,
                        new BigDecimal("1000.00"),
                        Currency.AZN.name(),
                        "LOAN_PAYMENT",
                        "FAILED",
                        "Loan payment",
                        LocalDateTime.now(),
                        LocalDateTime.now()
                );

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(transactionServiceClient.createLoanPayment(any()))
                .thenReturn(transaction);

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        () -> loanService.makePayment(
                                loanId,
                                new BigDecimal("1000.00"),
                                "127.0.0.1"
                        )
                );

        assertEquals(
                "Loan payment transaction failed",
                exception.getMessage()
        );

        assertEquals(
                new BigDecimal("10000.00"),
                loan.getRemainingAmount()
        );

        verify(
                loanPaymentRepository,
                never()
        ).save(any());
    }

    @Test
    void makePayment_amountExceedsRemainingAmount() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        TransactionResponse transaction =
                new TransactionResponse(
                        UUID.randomUUID(),
                        accountId,
                        null,
                        new BigDecimal("15000.00"),
                        Currency.AZN.name(),
                        "LOAN_PAYMENT",
                        "COMPLETED",
                        "Loan payment",
                        LocalDateTime.now(),
                        LocalDateTime.now()
                );

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(transactionServiceClient.createLoanPayment(any()))
                .thenReturn(transaction);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loanService.makePayment(
                                loanId,
                                new BigDecimal("15000.00"),
                                "127.0.0.1"
                        )
                );

        assertEquals(
                "Payment amount cannot exceed remaining loan amount",
                exception.getMessage()
        );

        verify(
                loanPaymentRepository,
                never()
        ).save(any());

        assertEquals(
                new BigDecimal("10000.00"),
                loan.getRemainingAmount()
        );
    }

    @Test
    void getPaymentHistory_success() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        LoanPayment payment1 =
                new LoanPayment(
                        loanId,
                        new BigDecimal("1000.00"),
                        new BigDecimal("9000.00"),
                        LoanPaymentStatus.COMPLETED
                );

        LoanPayment payment2 =
                new LoanPayment(
                        loanId,
                        new BigDecimal("2000.00"),
                        new BigDecimal("7000.00"),
                        LoanPaymentStatus.COMPLETED
                );

        LoanPaymentResponse response1 =
                mock(LoanPaymentResponse.class);

        LoanPaymentResponse response2 =
                mock(LoanPaymentResponse.class);

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.of(loan));

        when(loanPaymentRepository
                .findAllByLoanIdOrderByCreatedAtDesc(loanId))
                .thenReturn(List.of(payment1, payment2));

        when(loanPaymentMapper.toResponse(payment1))
                .thenReturn(response1);

        when(loanPaymentMapper.toResponse(payment2))
                .thenReturn(response2);

        List<LoanPaymentResponse> result =
                loanService.getPaymentHistory(loanId);

        assertEquals(
                List.of(response1, response2),
                result
        );

        verify(
                loanPaymentRepository
        ).findAllByLoanIdOrderByCreatedAtDesc(loanId);
    }

    @Test
    void getPaymentHistory_loanNotFound() {

        when(loanRepository.findById(loanId))
                .thenReturn(Optional.empty());

        assertThrows(
                LoanNotFoundException.class,
                () -> loanService.getPaymentHistory(loanId)
        );

        verify(
                loanPaymentRepository,
                never()
        ).findAllByLoanIdOrderByCreatedAtDesc(any());
    }

    private Loan createLoan(LoanStatus status) {

        return new Loan(
                userId,
                accountId,
                new BigDecimal("10000.00"),
                new BigDecimal("12.00"),
                12,
                new BigDecimal("888.4879"),
                new BigDecimal("10000.00"),
                Currency.AZN,
                status
        );
    }
}