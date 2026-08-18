package az.texnoera.bank.userservice.user.client;

import az.texnoera.bank.userservice.user.dto.request.VerificationEmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "notification-service",
        url = "${clients.notification-service.url}"
)
public interface NotificationClient {

    @PostMapping("/api/v1/notifications/email/verification")
    void sendVerificationEmail(
            @RequestBody VerificationEmailRequest request
    );
}