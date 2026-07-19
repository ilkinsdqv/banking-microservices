package az.texnoera.bank.common.exception;

public class BusinessException extends RuntimeException {
    protected BusinessException(String message) {
        super(message);
    }
}
