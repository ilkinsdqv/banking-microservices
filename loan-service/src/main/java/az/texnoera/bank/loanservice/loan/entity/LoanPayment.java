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
@Table(name = "loan_payments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LoanPayment extends BaseEntity {

    @Column(nullable = false)
    private UUID loanId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal remainingAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LoanPaymentStatus status;

    public LoanPayment(
            UUID loanId,
            BigDecimal amount,
            BigDecimal remainingAmount,
            LoanPaymentStatus status
    ) {
        this.loanId = loanId;
        this.amount = amount;
        this.remainingAmount = remainingAmount;
        this.status = status;
    }
}