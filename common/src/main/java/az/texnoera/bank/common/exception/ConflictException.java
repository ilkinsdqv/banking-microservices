package az.texnoera.bank.common.exception;

import az.texnoera.bank.common.api.ErrorCode;

public class ConflictException extends BusinessException {
    protected ConflictException(ErrorCode code, String message) {
        super(code, message);
    }
}
