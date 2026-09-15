package az.texnoera.bank.complaintservice.client;

import feign.FeignException;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserClientFallbackFactory
        implements FallbackFactory<UserClient> {

    @Override
    public UserClient create(Throwable cause) {

        return new UserClient() {

            @Override
            public Boolean userExists(UUID id) {

                if (cause instanceof FeignException.NotFound) {
                    return false;
                }

                throw new IllegalStateException(
                        "User Service is temporarily unavailable",
                        cause
                );
            }
        };
    }
}