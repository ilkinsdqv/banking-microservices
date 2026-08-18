package az.texnoera.bank.userservice.user.exception;

import az.texnoera.bank.common.api.ErrorCode;
import az.texnoera.bank.common.exception.BusinessException;

public class InvalidPasswordException extends BusinessException {

    public InvalidPasswordException() {
        super(
                ErrorCode.INVALID_PASSWORD,
                "Current password is incorrect"
        );
    }
}