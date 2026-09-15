package az.texnoera.bank.accountservice.account.dto.response;

import az.texnoera.bank.accountservice.account.entity.AccountType;
import az.texnoera.bank.accountservice.account.entity.Currency;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AccountResponse(
        UUID id,
        UUID userId,
        String iban,
        BigDecimal balance,
        Currency currency,
        AccountType type,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}