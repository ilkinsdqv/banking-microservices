package az.texnoera.bank.accountservice.account.service;

import az.texnoera.bank.accountservice.account.dto.request.CreateAccountRequest;
import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;

import java.util.List;
import java.util.UUID;

public interface AccountService {

    AccountResponse createAccount(CreateAccountRequest request);

    AccountResponse getAccountById(UUID id);

    List<AccountResponse> getAccountsByUserId(UUID userId);
}