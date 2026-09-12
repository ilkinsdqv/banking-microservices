package az.texnoera.bank.transactionservice.transaction.dto.request;

import az.texnoera.bank.transactionservice.transaction.entity.Currency;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateLoanDisbursementRequest(

        @NotNull
        UUID userId,

        @NotNull
        UUID accountId,

        @NotNull
        @DecimalMin("0.01")
        BigDecimal amount,

        @NotNull
        Currency currency,

        @Size(max = 500)
        String description
) {
}