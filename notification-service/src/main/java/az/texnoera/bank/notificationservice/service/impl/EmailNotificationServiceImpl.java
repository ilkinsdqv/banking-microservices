package az.texnoera.bank.notificationservice.service.impl;

import az.texnoera.bank.notificationservice.dto.request.SendVerificationEmailRequest;
import az.texnoera.bank.notificationservice.service.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailNotificationServiceImpl
        implements EmailNotificationService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(
            SendVerificationEmailRequest request
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(request.email());
        message.setSubject("Verify your email");
        message.setText("""
                Hello %s,

                Please verify your email address by clicking the link below:

                http://localhost:8081/api/v1/users/email-verification/verify?token=%s

                This link will expire after 24 hours.

                Regards,
                Banking System
                """.formatted(
                request.firstName(),
                request.verificationToken()
        ));

        mailSender.send(message);
    }
}