package az.texnoera.bank.complaintservice.common;

import az.texnoera.bank.common.api.ApiErrorResponse;
import az.texnoera.bank.common.api.ErrorCode;
import az.texnoera.bank.complaintservice.complaint.exception.ComplaintNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ComplaintNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleComplaintNotFound(
            ComplaintNotFoundException exception
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                ErrorCode.COMPLAINT_NOT_FOUND,
                exception.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(
            IllegalArgumentException exception
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCode.BAD_REQUEST,
                exception.getMessage()
        );
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalState(
            IllegalStateException exception
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCode.BAD_REQUEST,
                exception.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error ->
                        error.getField() + ": " + error.getDefaultMessage()
                )
                .findFirst()
                .orElse("Validation failed");

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCode.VALIDATION_ERROR,
                message
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(
            Exception exception
    ) {
        log.error("Unexpected error occurred", exception);

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            ErrorCode code,
            String message
    ) {
        return ResponseEntity
                .status(status)
                .body(
                        new ApiErrorResponse(
                                LocalDateTime.now(),
                                status.value(),
                                code,
                                message
                        )
                );
    }
}