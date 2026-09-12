package az.texnoera.bank.loanservice.loan.dto.request;

import az.texnoera.bank.loanservice.loan.entity.Currency;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateLoanRequest(

        @NotNull
        UUID accountId,

        @NotNull
        @DecimalMin(value = "100.00")
        BigDecimal principalAmount,

        @NotNull
        @DecimalMin(value = "0.00")
        BigDecimal interestRate,

        @NotNull
        @Min(1)
        @Max(120)
        Integer termMonths,

        @NotNull
        Currency currency
) {
}