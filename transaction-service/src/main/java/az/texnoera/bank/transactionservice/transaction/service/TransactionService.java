package az.texnoera.bank.transactionservice.transaction.service;

import az.texnoera.bank.transactionservice.transaction.dto.request.CreateTransactionRequest;
import az.texnoera.bank.transactionservice.transaction.dto.response.TransactionResponse;
import az.texnoera.bank.transactionservice.transaction.entity.Currency;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TransactionService {

    TransactionResponse createTransaction(
            UUID userId,
            CreateTransactionRequest request,
            String ipAddress
    );

    TransactionResponse getTransactionById(UUID id);

    List<TransactionResponse> getTransactionsByAccountId(
            UUID accountId
    );

    TransactionResponse createLoanPayment(
            UUID userId,
            UUID accountId,
            BigDecimal amount,
            Currency currency,
            String description,
            String ipAddress
    );

    TransactionResponse createLoanDisbursement(
            UUID userId,
            UUID accountId,
            BigDecimal amount,
            Currency currency,
            String description,
            String ipAddress
    );
}