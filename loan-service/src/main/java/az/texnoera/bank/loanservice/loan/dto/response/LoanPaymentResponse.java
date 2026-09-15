package az.texnoera.bank.loanservice.loan.dto.response;

import az.texnoera.bank.loanservice.loan.entity.LoanPaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record LoanPaymentResponse(
        UUID id,
        UUID loanId,
        BigDecimal amount,
        BigDecimal remainingAmount,
        LoanPaymentStatus status,
        LocalDateTime createdAt
) {
}