package az.texnoera.bank.userservice.user.dto.request;

public record VerificationEmailRequest(
        String email,
        String firstName,
        String verificationToken
) {
}
