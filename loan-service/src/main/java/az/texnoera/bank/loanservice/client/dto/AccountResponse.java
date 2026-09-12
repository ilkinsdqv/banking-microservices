package az.texnoera.bank.loanservice.client.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AccountResponse(
        UUID id,
        UUID userId,
        String iban,
        BigDecimal balance,
        String currency,
        String type,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}