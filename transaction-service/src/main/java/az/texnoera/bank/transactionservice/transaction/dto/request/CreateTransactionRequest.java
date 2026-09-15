package az.texnoera.bank.transactionservice.transaction.dto.request;

import az.texnoera.bank.transactionservice.transaction.entity.Currency;
import az.texnoera.bank.transactionservice.transaction.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionRequest(

        UUID fromAccountId,

        UUID toAccountId,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        @NotNull
        Currency currency,

        @NotNull
        TransactionType type,

        @Size(max = 500)
        String description
) {
}