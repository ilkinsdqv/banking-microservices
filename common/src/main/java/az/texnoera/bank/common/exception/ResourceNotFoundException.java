package az.texnoera.bank.common.exception;

import az.texnoera.bank.common.api.ErrorCode;

public class ResourceNotFoundException extends BusinessException {
    protected ResourceNotFoundException(ErrorCode code, String message) {
        super(code, message);
    }
}
