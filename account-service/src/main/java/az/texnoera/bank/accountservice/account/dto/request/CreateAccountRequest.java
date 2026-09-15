package az.texnoera.bank.accountservice.account.dto.request;

import az.texnoera.bank.accountservice.account.entity.AccountType;
import az.texnoera.bank.accountservice.account.entity.Currency;
import jakarta.validation.constraints.NotNull;

public record CreateAccountRequest(

        @NotNull
        Currency currency,

        @NotNull
        AccountType type
) {
}