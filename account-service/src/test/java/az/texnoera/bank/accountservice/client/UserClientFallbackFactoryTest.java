package az.texnoera.bank.accountservice.client;

import feign.FeignException;
import feign.Request;
import feign.Response;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserClientFallbackFactoryTest {

    private final UserClientFallbackFactory factory =
            new UserClientFallbackFactory();

    @Test
    void shouldReturnFalseWhenUserServiceReturnsNotFound() {
        UserClient fallback = factory.create(notFound());

        assertThat(fallback.userExists(UUID.randomUUID())).isFalse();
    }

    @Test
    void shouldThrowUnavailableWhenUserServiceFailureIsNotNotFound() {
        RuntimeException cause = new RuntimeException("connection refused");
        UserClient fallback = factory.create(cause);

        assertThatThrownBy(() -> fallback.userExists(UUID.randomUUID()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("User Service is temporarily unavailable")
                .hasCause(cause);
    }

    private static FeignException.NotFound notFound() {
        Request request = Request.create(
                Request.HttpMethod.GET,
                "/api/v1/users/" + UUID.randomUUID() + "/exists",
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
