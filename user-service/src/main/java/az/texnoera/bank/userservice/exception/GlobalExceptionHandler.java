package az.texnoera.bank.userservice.exception;

import az.texnoera.bank.common.api.ApiErrorResponse;
import az.texnoera.bank.common.api.ErrorCode;
import az.texnoera.bank.common.api.ValidationErrorResponse;
import az.texnoera.bank.common.exception.ConflictException;
import az.texnoera.bank.common.exception.ResourceNotFoundException;
import az.texnoera.bank.userservice.user.exception.EmailVerificationTokenExpiredException;
import az.texnoera.bank.userservice.user.exception.EmailVerificationTokenInvalidException;
import az.texnoera.bank.userservice.user.exception.InvalidPasswordException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse handleValidationException(MethodArgumentNotValidException ex) {
        log.warn("Validation failed: {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );
        return new ValidationErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ErrorCode.VALIDATION_ERROR,
                "Validation Failed",
                errors
        );
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiErrorResponse handleConflictException(ConflictException ex) {
        log.warn("Business conflict: {}", ex.getMessage());
        return new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                ex.getErrorCode(),
                "A resource with the provided information already exists"
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getErrorCode(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiErrorResponse handleException(Exception ex) {
        log.error("Unexpected error occurred", ex);
        return new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ErrorCode.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred."
        );
    }

    @ExceptionHandler(InvalidPasswordException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleInvalidPasswordException(InvalidPasswordException ex) {
        log.warn("Invalid password: {}", ex.getMessage());
        return new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ErrorCode.INVALID_PASSWORD,
                ex.getMessage()
        );
    }

    @ExceptionHandler(EmailVerificationTokenInvalidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleInvalidEmailVerificationToken(
            EmailVerificationTokenInvalidException ex
    ) {
        log.warn("Invalid email verification token: {}", ex.getMessage());

        return new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ErrorCode.INVALID_EMAIL_VERIFICATION_TOKEN,
                ex.getMessage()
        );
    }

    @ExceptionHandler(EmailVerificationTokenExpiredException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleExpiredEmailVerificationToken(
            EmailVerificationTokenExpiredException ex
    ) {
        log.warn("Expired email verification token: {}", ex.getMessage());

        return new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ErrorCode.EMAIL_VERIFICATION_TOKEN_EXPIRED,
                ex.getMessage()
        );
    }

}
