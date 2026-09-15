package az.texnoera.bank.transactionservice.client;

import az.texnoera.bank.transactionservice.client.dto.AccountResponse;
import az.texnoera.bank.transactionservice.config.FeignSecurityConfig;
import az.texnoera.bank.transactionservice.transaction.dto.request.BalanceOperationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(
        name = "account-service",
        configuration = FeignSecurityConfig.class,
        fallbackFactory = AccountClientFallbackFactory.class
)
public interface AccountClient {

    @GetMapping("/api/v1/accounts/internal/{id}")
    AccountResponse getAccountById(
            @PathVariable UUID id
    );

    @PostMapping("/api/v1/accounts/{id}/deposit")
    AccountResponse deposit(
            @PathVariable UUID id,
            @RequestBody BalanceOperationRequest request
    );

    @PostMapping("/api/v1/accounts/{id}/withdraw")
    AccountResponse withdraw(
            @PathVariable UUID id,
            @RequestBody BalanceOperationRequest request
    );
}