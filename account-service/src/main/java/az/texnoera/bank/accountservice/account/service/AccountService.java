package az.texnoera.bank.accountservice.account.service;

import az.texnoera.bank.accountservice.account.dto.request.CreateAccountRequest;
import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface AccountService {

    AccountResponse createAccount(
            UUID userId,
            CreateAccountRequest request
    );

    AccountResponse getAccountById(UUID id);

    List<AccountResponse> getAccountsByUserId(UUID userId);

    AccountResponse deposit(UUID accountId, BigDecimal amount);

    AccountResponse withdraw(UUID accountId, BigDecimal amount);
}