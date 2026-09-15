package az.texnoera.bank.transactionservice.client;

import az.texnoera.bank.transactionservice.transaction.dto.request.BalanceOperationRequest;
import feign.FeignException;
import feign.Request;
import feign.Response;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AccountClientFallbackFactoryTest {

    private final AccountClientFallbackFactory factory =
            new AccountClientFallbackFactory();

    @Test
    void shouldTranslateNotFoundForAccountLookup() {
        UUID accountId = UUID.randomUUID();
        AccountClient fallback = factory.create(notFound());

        assertThatThrownBy(() -> fallback.getAccountById(accountId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Account not found with id: " + accountId);
    }

    @Test
    void shouldThrowUnavailableForDepositAndWithdrawFallbacks() {
        RuntimeException cause = new RuntimeException("connection refused");
        AccountClient fallback = factory.create(cause);
        UUID accountId = UUID.randomUUID();
        BalanceOperationRequest request =
                new BalanceOperationRequest(BigDecimal.ONE);

        assertThatThrownBy(() -> fallback.deposit(accountId, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Account Service is temporarily unavailable")
                .hasCause(cause);
        assertThatThrownBy(() -> fallback.withdraw(accountId, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Account Service is temporarily unavailable")
                .hasCause(cause);
    }

    private static FeignException.NotFound notFound() {
        Request request = Request.create(
                Request.HttpMethod.GET,
                "/api/v1/accounts/internal/" + UUID.randomUUID(),
                Map.of(),
                null,
                StandardCharsets.UTF_8,
                null
        );

        Response response = Response.builder()
                .request(request)
                .status(404)
                .reason("Not Found")
                .headers(Map.of())
                .build();

        return new FeignException.NotFound(
                "not found",
                request,
                null,
                response.headers()
        );
    }
}
