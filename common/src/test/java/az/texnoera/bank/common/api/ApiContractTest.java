package az.texnoera.bank.common.api;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditEvent;
import az.texnoera.bank.common.audit.AuditStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ApiContractTest {

    @Test
    void shouldExposeApiErrorResponseFields() {
        LocalDateTime timestamp = LocalDateTime.now();

        ApiErrorResponse response = new ApiErrorResponse(
                timestamp,
                404,
                ErrorCode.USER_NOT_FOUND,
                "User not found"
        );

        assertThat(response.timestamp()).isEqualTo(timestamp);
        assertThat(response.status()).isEqualTo(404);
        assertThat(response.code()).isEqualTo(ErrorCode.USER_NOT_FOUND);
        assertThat(response.message()).isEqualTo("User not found");
    }

    @Test
    void shouldExposeValidationErrorsByField() {
        ValidationErrorResponse response = new ValidationErrorResponse(
                LocalDateTime.now(),
                400,
                ErrorCode.VALIDATION_ERROR,
                "Validation Failed",
                Map.of("email", "Email should be valid")
        );

        assertThat(response.errors())
                .containsEntry("email", "Email should be valid");
    }

    @Test
    void shouldExposeAuditEventContract() {
        UUID userId = UUID.randomUUID();
        UUID entityId = UUID.randomUUID();
        LocalDateTime occurredAt = LocalDateTime.now();

        AuditEvent event = new AuditEvent(
                userId,
                "user-service",
                AuditAction.USER_REGISTERED,
                "USER",
                entityId,
                "User registered",
                AuditStatus.SUCCESS,
                "127.0.0.1",
                occurredAt
        );

        assertThat(event.userId()).isEqualTo(userId);
        assertThat(event.serviceName()).isEqualTo("user-service");
        assertThat(event.action()).isEqualTo(AuditAction.USER_REGISTERED);
        assertThat(event.entityType()).isEqualTo("USER");
        assertThat(event.entityId()).isEqualTo(entityId);
        assertThat(event.status()).isEqualTo(AuditStatus.SUCCESS);
        assertThat(event.occurredAt()).isEqualTo(occurredAt);
    }
}
