package az.texnoera.bank.userservice.user.exception;

import az.texnoera.bank.common.api.ErrorCode;
import az.texnoera.bank.common.exception.ConflictException;

public class EmailAlreadyExistsException extends ConflictException {
    public EmailAlreadyExistsException(String email) {
        super(
                ErrorCode.EMAIL_ALREADY_EXISTS,
                "Email already exists: " + email);
    }
}
