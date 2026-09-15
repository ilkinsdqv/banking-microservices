package az.texnoera.bank.transactionservice.transaction.service.impl;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import az.texnoera.bank.transactionservice.audit.AuditEventPublisher;
import az.texnoera.bank.transactionservice.client.AccountClient;
import az.texnoera.bank.transactionservice.client.AccountServiceClient;
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
    private final AccountServiceClient accountServiceClient;
    private final AuditEventPublisher auditEventPublisher;

    @Override
    @Transactional
    public TransactionResponse createTransaction(
            UUID userId,
            CreateTransactionRequest request,
            String ipAddress
    ) {

        validateTransactionType(request);

        return switch (request.type()) {
            case DEPOSIT -> processDeposit(userId, request, ipAddress);
            case WITHDRAW -> processWithdraw(userId, request, ipAddress);
            case TRANSFER -> processTransfer(userId, request, ipAddress);
            case LOAN_DISBURSEMENT ->
                    throw new IllegalArgumentException(
                            "Loan disbursement must use internal endpoint"
                    );
        };
    }

    @Override
    @Transactional
    public TransactionResponse createLoanPayment(
            UUID userId,
            UUID accountId,
            BigDecimal amount,
            Currency currency,
            String description,
            String ipAddress
    ) {

        AccountResponse account =
                accountServiceClient.getAccountById(accountId);

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

        accountServiceClient.withdraw(
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

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        auditEventPublisher.publish(
                userId,
                AuditAction.LOAN_PAYMENT,
                "TRANSACTION",
                savedTransaction.getId(),
                description != null
                        ? description
                        : "Loan payment",
                AuditStatus.SUCCESS,
                ipAddress
        );

        return transactionMapper.toResponse(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponse createLoanDisbursement(
            UUID userId,
            UUID accountId,
            BigDecimal amount,
            Currency currency,
            String description,
            String ipAddress
    ) {

        AccountResponse account =
                accountServiceClient.getAccountById(accountId);

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

        accountServiceClient.deposit(
                accountId,
                new BalanceOperationRequest(amount)
        );

        Transaction transaction = new Transaction(
                null,
                accountId,
                amount,
                currency,
                TransactionType.LOAN_DISBURSEMENT,
                TransactionStatus.COMPLETED,
                description
        );

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        auditEventPublisher.publish(
                userId,
                AuditAction.LOAN_ACTIVATED,
                "TRANSACTION",
                savedTransaction.getId(),
                description != null
                        ? description
                        : "Loan disbursement",
                AuditStatus.SUCCESS,
                ipAddress
        );

        return transactionMapper.toResponse(savedTransaction);
    }

    private TransactionResponse processDeposit(
            UUID userId,
            CreateTransactionRequest request,
            String ipAddress
    ) {

        AccountResponse account =
                accountServiceClient.getAccountById(
                        request.toAccountId()
                );

        validateAccountOwner(account, userId);
        validateCurrency(account, request.currency());

        accountServiceClient.deposit(
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

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        auditEventPublisher.publish(
                userId,
                AuditAction.MONEY_DEPOSITED,
                "TRANSACTION",
                savedTransaction.getId(),
                request.description() != null
                        ? request.description()
                        : "Money deposited",
                AuditStatus.SUCCESS,
                ipAddress
        );

        return transactionMapper.toResponse(savedTransaction);
    }

    private TransactionResponse processWithdraw(
            UUID userId,
            CreateTransactionRequest request,
            String ipAddress
    ) {

        AccountResponse account =
                accountServiceClient.getAccountById(
                        request.fromAccountId()
                );

        validateAccountOwner(account, userId);
        validateCurrency(account, request.currency());

        accountServiceClient.withdraw(
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

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        auditEventPublisher.publish(
                userId,
                AuditAction.MONEY_WITHDRAWN,
                "TRANSACTION",
                savedTransaction.getId(),
                request.description() != null
                        ? request.description()
                        : "Money withdrawn",
                AuditStatus.SUCCESS,
                ipAddress
        );

        return transactionMapper.toResponse(savedTransaction);
    }

    private TransactionResponse processTransfer(
            UUID userId,
            CreateTransactionRequest request,
            String ipAddress
    ) {

        AccountResponse sourceAccount =
                accountServiceClient.getAccountById(
                        request.fromAccountId()
                );

        AccountResponse destinationAccount =
                accountServiceClient.getAccountById(
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

            accountServiceClient.withdraw(
                    sourceAccount.id(),
                    new BalanceOperationRequest(
                            request.amount()
                    )
            );

            try {

                accountServiceClient.deposit(
                        destinationAccount.id(),
                        new BalanceOperationRequest(
                                request.amount()
                        )
                );

            } catch (Exception depositException) {

                try {

                    accountServiceClient.deposit(
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

            Transaction completedTransaction =
                    transactionRepository.save(savedTransaction);

            auditEventPublisher.publish(
                    userId,
                    AuditAction.MONEY_TRANSFERRED,
                    "TRANSACTION",
                    completedTransaction.getId(),
                    request.description() != null
                            ? request.description()
                            : "Money transferred",
                    AuditStatus.SUCCESS,
                    ipAddress
            );

            return transactionMapper.toResponse(
                    completedTransaction
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

        case LOAN_DISBURSEMENT ->
                throw new IllegalArgumentException(
                        "Loan disbursement must use internal endpoint"
                );
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