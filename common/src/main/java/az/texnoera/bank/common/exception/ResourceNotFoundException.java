package az.texnoera.bank.common.exception;

public class ResourceNotFoundException extends BusinessException {
    protected ResourceNotFoundException(String message) {
        super(message);
    }
}
