package az.texnoera.bank.userservice.user.exception;

import az.texnoera.bank.common.exception.ConflictException;

public class EmailAlreadyExistsException extends ConflictException {
    public EmailAlreadyExistsException(String email) {
        super("Email already exists: " + email);
    }
}
