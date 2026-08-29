package az.texnoera.bank.authservice.client;

import az.texnoera.bank.authservice.dto.response.UserAuthResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "user-service",
        url = "${clients.user-service.url}"
)
public interface UserClient {

    @GetMapping("/api/v1/users/authentication")
    UserAuthResponse getUserForAuthentication(
            @RequestParam String email
    );
}