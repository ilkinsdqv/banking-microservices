package az.texnoera.bank.accountservice.client;

import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceClient {

    private final UserClient userClient;

    @Retry(name = "UserClientuserExistsUUID")
    @Bulkhead(
            name = "UserClientuserExistsUUID",
            type = Bulkhead.Type.SEMAPHORE
    )
    public Boolean userExists(UUID userId) {
        return userClient.userExists(userId);
    }
}