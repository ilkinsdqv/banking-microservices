package az.texnoera.bank.notificationservice.dto.request;

public record SendVerificationEmailRequest(
        String email,
        String firstName,
        String verificationToken
) {
}
