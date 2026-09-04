package az.texnoera.bank.accountservice.account.service.impl;

import az.texnoera.bank.accountservice.account.dto.request.CreateAccountRequest;
import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;
import az.texnoera.bank.accountservice.account.entity.Account;
import az.texnoera.bank.accountservice.account.mapper.AccountMapper;
import az.texnoera.bank.accountservice.account.repository.AccountRepository;
import az.texnoera.bank.accountservice.account.service.AccountService;
import az.texnoera.bank.accountservice.account.service.IbanGenerator;
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

    @Override
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {

        String iban;

        do {
            iban = ibanGenerator.generate();
        } while (accountRepository.existsByIban(iban));

        Account account = new Account(
                request.userId(),
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
                        new RuntimeException("Account not found: " + id)
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