package az.texnoera.bank.userservice.user.exception;

import az.texnoera.bank.common.api.ErrorCode;
import az.texnoera.bank.common.exception.ConflictException;

public class FinAlreadyExistsException extends ConflictException {
    public FinAlreadyExistsException(String fin) {
        super(ErrorCode.FIN_ALREADY_EXISTS, "FIN already exists: " + fin);
    }
}
