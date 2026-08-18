package az.texnoera.bank.notificationservice.service;

import az.texnoera.bank.notificationservice.dto.request.SendVerificationEmailRequest;

public interface EmailNotificationService {

    void sendVerificationEmail(SendVerificationEmailRequest request);
}