package az.texnoera.bank.loanservice.client;

import az.texnoera.bank.loanservice.client.dto.AccountResponse;
import az.texnoera.bank.loanservice.config.FeignSecurityConfig;
import az.texnoera.bank.loanservice.loan.dto.request.BalanceOperationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(
        name = "account-service",
        configuration = FeignSecurityConfig.class
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
}