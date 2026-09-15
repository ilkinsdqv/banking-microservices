package az.texnoera.bank.complaintservice.client;

import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceClient {

    private static final String USER_EXISTS =
            "UserClientuserExistsUUID";

    private final UserClient userClient;

    @Retry(name = USER_EXISTS)
    @Bulkhead(
            name = USER_EXISTS,
            type = Bulkhead.Type.SEMAPHORE
    )
    public Boolean userExists(UUID userId) {
        return userClient.userExists(userId);
    }
}