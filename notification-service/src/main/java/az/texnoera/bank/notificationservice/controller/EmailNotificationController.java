package az.texnoera.bank.notificationservice.controller;

import az.texnoera.bank.notificationservice.dto.request.SendVerificationEmailRequest;
import az.texnoera.bank.notificationservice.service.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications/email")
@RequiredArgsConstructor
public class EmailNotificationController {

    private final EmailNotificationService emailNotificationService;

    @PostMapping("/verification")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void sendVerificationEmail(
            @RequestBody SendVerificationEmailRequest request
    ) {
        emailNotificationService.sendVerificationEmail(request);
    }
}