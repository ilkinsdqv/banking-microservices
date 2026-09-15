package az.texnoera.bank.complaintservice.client;

import az.texnoera.bank.complaintservice.config.FeignSecurityConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(
        name = "user-service",
        configuration = FeignSecurityConfig.class,
        fallbackFactory = UserClientFallbackFactory.class
)
public interface UserClient {

    @GetMapping("/api/v1/users/{id}/exists")
    Boolean userExists(@PathVariable UUID id);
}