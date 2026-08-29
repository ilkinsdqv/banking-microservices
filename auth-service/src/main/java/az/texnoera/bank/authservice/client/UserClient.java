package az.texnoera.bank.authservice.client;

import az.texnoera.bank.authservice.dto.response.UserAuthResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(
        name = "user-service",
        url = "${clients.user-service.url}"
)
public interface UserClient {

    @GetMapping("/api/v1/users/authentication")
    UserAuthResponse getUserForAuthentication(
            @RequestParam String email
    );

    @GetMapping("api/v1/users/authentication/{id}")
    UserAuthResponse getUserForAuthenticationById(
            @PathVariable UUID id
    );
}