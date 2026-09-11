package az.texnoera.bank.transactionservice.transaction.service.impl;

import az.texnoera.bank.transactionservice.client.AccountClient;
import az.texnoera.bank.transactionservice.client.dto.AccountResponse;
import az.texnoera.bank.transactionservice.transaction.dto.request.BalanceOperationRequest;
import az.texnoera.bank.transactionservice.transaction.dto.request.CreateTransactionRequest;
import az.texnoera.bank.transactionservice.transaction.dto.response.TransactionResponse;
import az.texnoera.bank.transactionservice.transaction.entity.Currency;
import az.texnoera.bank.transactionservice.transaction.entity.Transaction;
import az.texnoera.bank.transactionservice.transaction.entity.TransactionStatus;
import az.texnoera.bank.transactionservice.transaction.entity.TransactionType;
import az.texnoera.bank.transactionservice.transaction.exception.TransactionNotFoundException;
import az.texnoera.bank.transactionservice.transaction.mapper.TransactionMapper;
import az.texnoera.bank.transactionservice.transaction.repository.TransactionRepository;
import az.texnoera.bank.transactionservice.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl
        implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final AccountClient accountClient;

    @Override
    @Transactional
    public TransactionResponse createTransaction(
            UUID userId,
            CreateTransactionRequest request
    ) {

        validateTransactionType(request);

        return switch (request.type()) {
            case DEPOSIT -> processDeposit(userId, request);
            case WITHDRAW -> processWithdraw(userId, request);
            case TRANSFER -> throw new UnsupportedOperationException(
                    "TRANSFER is not implemented yet"
            );
        };
    }

    private TransactionResponse processDeposit(
            UUID userId,
            CreateTransactionRequest request
    ) {

        AccountResponse account =
                accountClient.getAccountById(
                        request.toAccountId()
                );

        validateAccountOwner(account, userId);
        validateCurrency(account, request.currency());

        accountClient.deposit(
                account.id(),
                new BalanceOperationRequest(request.amount())
        );

        Transaction transaction = new Transaction(
                null,
                account.id(),
                request.amount(),
                request.currency(),
                TransactionType.DEPOSIT,
                TransactionStatus.COMPLETED,
                request.description()
        );

        return transactionMapper.toResponse(
                transactionRepository.save(transaction)
        );
    }

    private TransactionResponse processWithdraw(
            UUID userId,
            CreateTransactionRequest request
    ) {

        AccountResponse account =
                accountClient.getAccountById(
                        request.fromAccountId()
                );

        validateAccountOwner(account, userId);
        validateCurrency(account, request.currency());

        accountClient.withdraw(
                account.id(),
                new BalanceOperationRequest(request.amount())
        );

        Transaction transaction = new Transaction(
                account.id(),
                null,
                request.amount(),
                request.currency(),
                TransactionType.WITHDRAW,
                TransactionStatus.COMPLETED,
                request.description()
        );

        return transactionMapper.toResponse(
                transactionRepository.save(transaction)
        );
    }

    private void validateTransactionType(
            CreateTransactionRequest request
    ) {

        switch (request.type()) {

        case DEPOSIT -> {
            if (request.toAccountId() == null ||
                    request.fromAccountId() != null) {
                throw new IllegalArgumentException(
                        "DEPOSIT requires only toAccountId"
                );
            }
        }

        case WITHDRAW -> {
            if (request.fromAccountId() == null ||
                    request.toAccountId() != null) {
                throw new IllegalArgumentException(
                        "WITHDRAW requires only fromAccountId"
                );
            }
        }

        case TRANSFER -> {
            if (request.fromAccountId() == null ||
                    request.toAccountId() == null) {
                throw new IllegalArgumentException(
                        "TRANSFER requires both account IDs"
                );
            }
        }
        }
    }

    private void validateAccountOwner(
            AccountResponse account,
            UUID userId
    ) {
        if (!account.userId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Account does not belong to current user"
            );
        }
    }

    private void validateCurrency(
            AccountResponse account,
            Currency currency
    ) {
        if (!account.currency().equals(currency.name())) {
            throw new IllegalArgumentException(
                    "Account currency does not match transaction currency"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(UUID id) {

        return transactionRepository.findById(id)
                .map(transactionMapper::toResponse)
                .orElseThrow(() ->
                        new TransactionNotFoundException(id)
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByAccountId(
            UUID accountId
    ) {

        return transactionRepository
                .findAllByAccountId(accountId)
                .stream()
                .map(transactionMapper::toResponse)
                .toList();
    }
}