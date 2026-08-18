package az.texnoera.bank.userservice.user.exception;

public class EmailVerificationTokenExpiredException
        extends RuntimeException {

    public EmailVerificationTokenExpiredException() {
        super("Email verification token has expired");
    }
}