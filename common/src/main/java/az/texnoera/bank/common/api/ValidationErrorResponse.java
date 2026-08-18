package az.texnoera.bank.common.api;

import java.time.LocalDateTime;
import java.util.Map;

public record ValidationErrorResponse (
        LocalDateTime timestamp,
        int status,
        ErrorCode code,
        String message,
        Map<String,String> errors
){

}
