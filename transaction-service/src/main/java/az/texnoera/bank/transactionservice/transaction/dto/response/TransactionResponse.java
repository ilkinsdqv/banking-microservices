package az.texnoera.bank.transactionservice.transaction.dto.response;

import az.texnoera.bank.transactionservice.transaction.entity.Currency;
import az.texnoera.bank.transactionservice.transaction.entity.TransactionStatus;
import az.texnoera.bank.transactionservice.transaction.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        UUID fromAccountId,
        UUID toAccountId,
        BigDecimal amount,
        Currency currency,
        TransactionType type,
        TransactionStatus status,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}