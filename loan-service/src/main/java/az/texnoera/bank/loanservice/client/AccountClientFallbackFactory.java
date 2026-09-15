package az.texnoera.bank.loanservice.client;

import az.texnoera.bank.loanservice.client.dto.AccountResponse;
import az.texnoera.bank.loanservice.loan.dto.request.BalanceOperationRequest;
import feign.FeignException;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AccountClientFallbackFactory
        implements FallbackFactory<AccountClient> {

    @Override
    public AccountClient create(Throwable cause) {

        return new AccountClient() {

            @Override
            public AccountResponse getAccountById(UUID id) {

                if (cause instanceof FeignException.NotFound) {
                    throw new IllegalArgumentException(
                            "Account not found with id: " + id
                    );
                }

                throw new IllegalStateException(
                        "Account Service is temporarily unavailable",
                        cause
                );
            }

            @Override
            public AccountResponse deposit(
                    UUID id,
                    BalanceOperationRequest request
            ) {

                throw new IllegalStateException(
                        "Account Service is temporarily unavailable",
                        cause
                );
            }

            @Override
            public AccountResponse withdraw(
                    UUID id,
                    BalanceOperationRequest request
            ) {

                throw new IllegalStateException(
                        "Account Service is temporarily unavailable",
                        cause
                );
            }
        };
    }
}