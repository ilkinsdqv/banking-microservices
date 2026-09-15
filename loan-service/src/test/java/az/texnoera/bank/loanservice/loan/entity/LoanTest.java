package az.texnoera.bank.loanservice.loan.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class LoanTest {

    private UUID userId;
    private UUID accountId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        accountId = UUID.randomUUID();
    }

    @Test
    void approve_pendingLoan_changesStatusToApproved() {

        Loan loan = createLoan(LoanStatus.PENDING);

        loan.approve();

        assertEquals(
                LoanStatus.APPROVED,
                loan.getStatus()
        );
    }

    @Test
    void approve_nonPendingLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        loan::approve
                );

        assertEquals(
                "Loan must be in PENDING status but is ACTIVE",
                exception.getMessage()
        );
    }

    @Test
    void reject_pendingLoan_changesStatusToRejected() {

        Loan loan = createLoan(LoanStatus.PENDING);

        loan.reject();

        assertEquals(
                LoanStatus.REJECTED,
                loan.getStatus()
        );
    }

    @Test
    void reject_nonPendingLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.APPROVED);

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        loan::reject
                );

        assertEquals(
                "Loan must be in PENDING status but is APPROVED",
                exception.getMessage()
        );
    }

    @Test
    void activate_approvedLoan_changesStatusToActive() {

        Loan loan = createLoan(LoanStatus.APPROVED);

        loan.activate();

        assertEquals(
                LoanStatus.ACTIVE,
                loan.getStatus()
        );
    }

    @Test
    void activate_nonApprovedLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.PENDING);

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        loan::activate
                );

        assertEquals(
                "Loan must be in APPROVED status but is PENDING",
                exception.getMessage()
        );
    }

    @Test
    void cancel_pendingLoan_changesStatusToCancelled() {

        Loan loan = createLoan(LoanStatus.PENDING);

        loan.cancel();

        assertEquals(
                LoanStatus.CANCELLED,
                loan.getStatus()
        );
    }

    @Test
    void cancel_approvedLoan_changesStatusToCancelled() {

        Loan loan = createLoan(LoanStatus.APPROVED);

        loan.cancel();

        assertEquals(
                LoanStatus.CANCELLED,
                loan.getStatus()
        );
    }

    @Test
    void cancel_activeLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        loan::cancel
                );

        assertEquals(
                "Only pending or approved loans can be cancelled",
                exception.getMessage()
        );
    }

    @Test
    void cancel_rejectedLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.REJECTED);

        assertThrows(
                IllegalStateException.class,
                loan::cancel
        );
    }

    @Test
    void makePayment_activeLoan_reducesRemainingAmount() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        loan.makePayment(
                new BigDecimal("2500.00")
        );

        assertEquals(
                0,
                loan.getRemainingAmount()
                        .compareTo(new BigDecimal("7500.00"))
        );

        assertEquals(
                LoanStatus.ACTIVE,
                loan.getStatus()
        );
    }

    @Test
    void makePayment_fullAmount_changesStatusToPaid() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        loan.makePayment(
                new BigDecimal("10000.00")
        );

        assertEquals(
                0,
                loan.getRemainingAmount()
                        .compareTo(BigDecimal.ZERO)
        );

        assertEquals(
                LoanStatus.PAID,
                loan.getStatus()
        );
    }

    @Test
    void makePayment_amountExceedsRemainingAmount_throwsException() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loan.makePayment(
                                new BigDecimal("10000.01")
                        )
                );

        assertEquals(
                "Payment amount cannot exceed remaining loan amount",
                exception.getMessage()
        );

        assertEquals(
                0,
                loan.getRemainingAmount()
                        .compareTo(new BigDecimal("10000.00"))
        );

        assertEquals(
                LoanStatus.ACTIVE,
                loan.getStatus()
        );
    }

    @Test
    void makePayment_zeroAmount_throwsException() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loan.makePayment(BigDecimal.ZERO)
                );

        assertEquals(
                "Payment amount must be greater than zero",
                exception.getMessage()
        );
    }

    @Test
    void makePayment_negativeAmount_throwsException() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loan.makePayment(
                                new BigDecimal("-100.00")
                        )
                );

        assertEquals(
                "Payment amount must be greater than zero",
                exception.getMessage()
        );
    }

    @Test
    void makePayment_nullAmount_throwsException() {

        Loan loan = createLoan(LoanStatus.ACTIVE);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> loan.makePayment(null)
                );

        assertEquals(
                "Payment amount must be greater than zero",
                exception.getMessage()
        );
    }

    @Test
    void makePayment_pendingLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.PENDING);

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        () -> loan.makePayment(
                                new BigDecimal("100.00")
                        )
                );

        assertEquals(
                "Loan must be in ACTIVE status but is PENDING",
                exception.getMessage()
        );
    }

    @Test
    void makePayment_approvedLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.APPROVED);

        assertThrows(
                IllegalStateException.class,
                () -> loan.makePayment(
                        new BigDecimal("100.00")
                )
        );
    }

    @Test
    void makePayment_paidLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.PAID);

        assertThrows(
                IllegalStateException.class,
                () -> loan.makePayment(
                        new BigDecimal("100.00")
                )
        );
    }

    @Test
    void makePayment_cancelledLoan_throwsException() {

        Loan loan = createLoan(LoanStatus.CANCELLED);

        assertThrows(
                IllegalStateException.class,
                () -> loan.makePayment(
                        new BigDecimal("100.00")
                )
        );
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