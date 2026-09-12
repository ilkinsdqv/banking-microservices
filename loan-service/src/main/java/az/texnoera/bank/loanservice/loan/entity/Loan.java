package az.texnoera.bank.loanservice.loan.entity;

import az.texnoera.bank.common.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "loans")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Loan extends BaseEntity {

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID accountId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal principalAmount;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private Integer termMonths;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal monthlyPayment;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal remainingAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 3)
    private Currency currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LoanStatus status;

    public Loan(
            UUID userId,
            UUID accountId,
            BigDecimal principalAmount,
            BigDecimal interestRate,
            Integer termMonths,
            BigDecimal monthlyPayment,
            BigDecimal remainingAmount,
            Currency currency,
            LoanStatus status
    ) {
        this.userId = userId;
        this.accountId = accountId;
        this.principalAmount = principalAmount;
        this.interestRate = interestRate;
        this.termMonths = termMonths;
        this.monthlyPayment = monthlyPayment;
        this.remainingAmount = remainingAmount;
        this.currency = currency;
        this.status = status;
    }

    public void approve() {
        requireStatus(LoanStatus.PENDING);

        status = LoanStatus.APPROVED;
    }

    public void reject() {
        requireStatus(LoanStatus.PENDING);

        status = LoanStatus.REJECTED;
    }

    public void activate() {
        requireStatus(LoanStatus.APPROVED);

        status = LoanStatus.ACTIVE;
    }

    public void cancel() {
        if (status != LoanStatus.PENDING && status != LoanStatus.APPROVED) {
            throw new IllegalStateException(
                    "Only pending or approved loans can be cancelled"
            );
        }

        status = LoanStatus.CANCELLED;
    }

    public void makePayment(BigDecimal amount) {
        validatePositiveAmount(amount);

        requireStatus(LoanStatus.ACTIVE);

        if (amount.compareTo(remainingAmount) > 0) {
            throw new IllegalArgumentException(
                    "Payment amount cannot exceed remaining loan amount"
            );
        }

        remainingAmount = remainingAmount.subtract(amount);

        if (remainingAmount.compareTo(BigDecimal.ZERO) == 0) {
            status = LoanStatus.PAID;
        }
    }

    private void requireStatus(LoanStatus expectedStatus) {
        if (status != expectedStatus) {
            throw new IllegalStateException(
                    "Loan must be in " + expectedStatus +
                            " status but is " + status
            );
        }
    }

    private void validatePositiveAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero"
            );
        }
    }
}