package az.texnoera.bank.transactionservice.config;

import az.texnoera.bank.transactionservice.client.AccountClient;
import az.texnoera.bank.transactionservice.client.dto.AccountResponse;
import az.texnoera.bank.transactionservice.transaction.entity.Transaction;
import az.texnoera.bank.transactionservice.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("transactionSecurityService")
@RequiredArgsConstructor
public class TransactionSecurityService {

    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;

    public boolean isOwner(
            Authentication authentication,
            UUID transactionId
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID currentUserId)) {
            return false;
        }

        return transactionRepository.findById(transactionId)
                .map(transaction ->
                        isTransactionOwner(
                                transaction,
                                currentUserId
                        )
                )
                .orElse(false);
    }

    public boolean isAccountOwner(
            Authentication authentication,
            UUID accountId
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID currentUserId)) {
            return false;
        }

        AccountResponse account =
                accountClient.getAccountById(accountId);

        return account.userId().equals(currentUserId);
    }

    private boolean isTransactionOwner(
            Transaction transaction,
            UUID currentUserId
    ) {

        if (transaction.getFromAccountId() != null) {

            AccountResponse account =
                    accountClient.getAccountById(
                            transaction.getFromAccountId()
                    );

            if (account.userId().equals(currentUserId)) {
                return true;
            }
        }

        if (transaction.getToAccountId() != null) {

            AccountResponse account =
                    accountClient.getAccountById(
                            transaction.getToAccountId()
                    );

            return account.userId().equals(currentUserId);
        }

        return false;
    }
}