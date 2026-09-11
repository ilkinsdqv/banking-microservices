package az.texnoera.bank.loanservice.loan.entity;

import az.texnoera.bank.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
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
        if (this.status != LoanStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending loans can be approved"
            );
        }

        this.status = LoanStatus.APPROVED;
    }

    public void reject() {
        if (this.status != LoanStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending loans can be rejected"
            );
        }

        this.status = LoanStatus.REJECTED;
    }

    public void activate() {
        if (this.status != LoanStatus.APPROVED) {
            throw new IllegalStateException(
                    "Only approved loans can be activated"
            );
        }

        this.status = LoanStatus.ACTIVE;
    }

    public void cancel() {
        if (this.status != LoanStatus.PENDING) {
            throw new IllegalStateException(
                    "Only pending loans can be cancelled"
            );
        }

        this.status = LoanStatus.CANCELLED;
    }

    public void makePayment(BigDecimal amount) {

        validatePositiveAmount(amount);

        if (this.status != LoanStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Payments can only be made for active loans"
            );
        }

        if (amount.compareTo(this.remainingAmount) > 0) {
            throw new IllegalArgumentException(
                    "Payment cannot exceed remaining loan amount"
            );
        }

        this.remainingAmount =
                this.remainingAmount.subtract(amount);

        if (this.remainingAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.status = LoanStatus.PAID;
        }
    }

    private void validatePositiveAmount(BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be greater than zero"
            );
        }
    }
}