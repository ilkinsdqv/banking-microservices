package az.texnoera.bank.transactionservice.transaction.service;

import az.texnoera.bank.transactionservice.transaction.dto.request.CreateTransactionRequest;
import az.texnoera.bank.transactionservice.transaction.dto.response.TransactionResponse;

import java.util.List;
import java.util.UUID;

public interface TransactionService {

    TransactionResponse createTransaction(
            UUID userId,
            CreateTransactionRequest request
    );

    TransactionResponse getTransactionById(UUID id);

    List<TransactionResponse> getTransactionsByAccountId(
            UUID accountId
    );
}