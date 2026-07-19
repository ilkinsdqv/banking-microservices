package az.texnoera.bank.userservice.user.exception;

import az.texnoera.bank.common.exception.ConflictException;

public class FinAlreadyExistsException extends ConflictException {
    public FinAlreadyExistsException(String fin) {
        super("FIN already exists: " + fin);
    }
}
