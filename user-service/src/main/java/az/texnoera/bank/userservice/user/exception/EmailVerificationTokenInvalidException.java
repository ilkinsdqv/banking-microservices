package az.texnoera.bank.userservice.user.exception;

public class EmailVerificationTokenInvalidException
        extends RuntimeException {

    public EmailVerificationTokenInvalidException() {
        super("Invalid email verification token");
    }
}