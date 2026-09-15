package az.texnoera.bank.loanservice.loan.dto.response;

import az.texnoera.bank.loanservice.loan.entity.Currency;
import az.texnoera.bank.loanservice.loan.entity.LoanStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record LoanResponse(
        UUID id,
        UUID userId,
        UUID accountId,
        BigDecimal principalAmount,
        BigDecimal interestRate,
        Integer termMonths,
        BigDecimal monthlyPayment,
        BigDecimal remainingAmount,
        Currency currency,
        LoanStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}