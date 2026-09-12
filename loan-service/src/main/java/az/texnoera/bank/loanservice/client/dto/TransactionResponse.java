package az.texnoera.bank.loanservice.client.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        UUID fromAccountId,
        UUID toAccountId,
        BigDecimal amount,
        String currency,
        String type,
        String status,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}