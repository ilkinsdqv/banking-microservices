package az.texnoera.bank.common.api;

import java.time.LocalDateTime;

public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        ErrorCode code,
        String message
) {
}
