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

import java.math.BigDecimal;
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
            case TRANSFER -> processTransfer(userId, request);
        };
    }

    @Override
    @Transactional
    public TransactionResponse createLoanPayment(
            UUID userId,
            UUID accountId,
            BigDecimal amount,
            Currency currency,
            String description
    ) {
        AccountResponse account = accountClient.getAccountById(accountId);

        if (!account.userId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Account does not belong to user"
            );
        }

        if (!account.currency().equals(currency.name())) {
            throw new IllegalArgumentException(
                    "Account currency does not match transaction currency"
            );
        }

        accountClient.withdraw(
                accountId,
                new BalanceOperationRequest(amount)
        );

        Transaction transaction = new Transaction(
                accountId,
                null,
                amount,
                currency,
                TransactionType.WITHDRAW,
                TransactionStatus.COMPLETED,
                description
        );

        return transactionMapper.toResponse(
                transactionRepository.save(transaction)
        );
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

    private TransactionResponse processTransfer(
            UUID userId,
            CreateTransactionRequest request
    ) {

        AccountResponse sourceAccount =
                accountClient.getAccountById(
                        request.fromAccountId()
                );

        AccountResponse destinationAccount =
                accountClient.getAccountById(
                        request.toAccountId()
                );

        validateAccountOwner(sourceAccount, userId);

        validateDifferentAccounts(
                sourceAccount,
                destinationAccount
        );

        validateCurrency(
                sourceAccount,
                request.currency()
        );

        validateCurrency(
                destinationAccount,
                request.currency()
        );

        Transaction transaction = new Transaction(
                sourceAccount.id(),
                destinationAccount.id(),
                request.amount(),
                request.currency(),
                TransactionType.TRANSFER,
                TransactionStatus.PENDING,
                request.description()
        );

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        try {

            accountClient.withdraw(
                    sourceAccount.id(),
                    new BalanceOperationRequest(
                            request.amount()
                    )
            );

            try {

                accountClient.deposit(
                        destinationAccount.id(),
                        new BalanceOperationRequest(
                                request.amount()
                        )
                );

            } catch (Exception depositException) {

                try {
                    accountClient.deposit(
                            sourceAccount.id(),
                            new BalanceOperationRequest(
                                    request.amount()
                            )
                    );
                } catch (Exception compensationException) {
                    depositException.addSuppressed(
                            compensationException
                    );
                }

                savedTransaction.fail();
                transactionRepository.save(savedTransaction);

                throw depositException;
            }

            savedTransaction.complete();
            transactionRepository.save(savedTransaction);

            return transactionMapper.toResponse(
                    savedTransaction
            );

        } catch (Exception exception) {

            savedTransaction.fail();
            transactionRepository.save(savedTransaction);

            throw exception;
        }
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

    private void validateDifferentAccounts(
            AccountResponse sourceAccount,
            AccountResponse destinationAccount
    ) {

        if (sourceAccount.id().equals(destinationAccount.id())) {
            throw new IllegalArgumentException(
                    "Source and destination accounts must be different"
            );
        }
    }
}