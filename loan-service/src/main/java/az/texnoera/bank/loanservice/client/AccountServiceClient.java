package az.texnoera.bank.loanservice.client;

import az.texnoera.bank.loanservice.client.dto.AccountResponse;
import az.texnoera.bank.loanservice.loan.dto.request.BalanceOperationRequest;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceClient {

    private static final String GET_ACCOUNT =
            "AccountClientgetAccountByIdUUID";

    private static final String DEPOSIT =
            "AccountClientdepositUUIDBalanceOperationRequest";

    private static final String WITHDRAW =
            "AccountClientwithdrawUUIDBalanceOperationRequest";

    private final AccountClient accountClient;

    @Retry(name = GET_ACCOUNT)
    @Bulkhead(
            name = GET_ACCOUNT,
            type = Bulkhead.Type.SEMAPHORE
    )
    public AccountResponse getAccountById(UUID accountId) {
        return accountClient.getAccountById(accountId);
    }

    @Retry(name = DEPOSIT)
    @Bulkhead(
            name = DEPOSIT,
            type = Bulkhead.Type.SEMAPHORE
    )
    public AccountResponse deposit(
            UUID accountId,
            BalanceOperationRequest request
    ) {
        return accountClient.deposit(accountId, request);
    }

    @Retry(name = WITHDRAW)
    @Bulkhead(
            name = WITHDRAW,
            type = Bulkhead.Type.SEMAPHORE
    )
    public AccountResponse withdraw(
            UUID accountId,
            BalanceOperationRequest request
    ) {
        return accountClient.withdraw(accountId, request);
    }
}