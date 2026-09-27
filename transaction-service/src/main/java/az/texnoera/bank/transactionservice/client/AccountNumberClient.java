package az.texnoera.bank.transactionservice.client;

import az.texnoera.bank.transactionservice.client.dto.AccountResponse;
import az.texnoera.bank.transactionservice.config.FeignSecurityConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "account-service",
        contextId = "accountNumberClient",
        configuration = FeignSecurityConfig.class
)
public interface AccountNumberClient {

    @GetMapping("/api/v1/accounts/internal/account-number/{accountNumber}")
    AccountResponse getAccountByAccountNumber(
            @PathVariable String accountNumber
    );
}
