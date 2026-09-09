package az.texnoera.bank.accountservice.account.service.impl;

import az.texnoera.bank.accountservice.account.dto.request.CreateAccountRequest;
import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;
import az.texnoera.bank.accountservice.account.entity.Account;
import az.texnoera.bank.accountservice.account.exception.AccountNotFoundException;
import az.texnoera.bank.accountservice.account.mapper.AccountMapper;
import az.texnoera.bank.accountservice.account.repository.AccountRepository;
import az.texnoera.bank.accountservice.account.service.AccountService;
import az.texnoera.bank.accountservice.account.service.IbanGenerator;
import az.texnoera.bank.accountservice.client.UserClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final IbanGenerator ibanGenerator;
    private final UserClient userClient;

    @Override
    @Transactional
    public AccountResponse createAccount(UUID userId, CreateAccountRequest request) {

        if (!userClient.userExists(userId)) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        String iban;

        do {
            iban = ibanGenerator.generate();
        } while (accountRepository.existsByIban(iban));

        Account account = new Account(
                userId,
                iban,
                BigDecimal.ZERO,
                request.currency(),
                request.type()
        );

        Account savedAccount = accountRepository.save(account);

        return accountMapper.toResponse(savedAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountById(UUID id) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() ->
                        new AccountNotFoundException(id)
                );

        return accountMapper.toResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAccountsByUserId(UUID userId) {

        return accountRepository.findAllByUserId(userId)
                .stream()
                .map(accountMapper::toResponse)
                .toList();
    }
}