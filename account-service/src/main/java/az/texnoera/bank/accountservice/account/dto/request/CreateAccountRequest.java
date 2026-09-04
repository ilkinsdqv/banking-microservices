package az.texnoera.bank.accountservice.account.dto.request;

import az.texnoera.bank.accountservice.account.entity.AccountType;
import az.texnoera.bank.accountservice.account.entity.Currency;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateAccountRequest(

        @NotNull
        UUID userId,

        @NotNull
        Currency currency,

        @NotNull
        AccountType type
) {
}