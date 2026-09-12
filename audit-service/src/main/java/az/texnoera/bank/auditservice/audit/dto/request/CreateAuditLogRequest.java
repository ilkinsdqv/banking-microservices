package az.texnoera.bank.auditservice.audit.dto.request;

import az.texnoera.bank.auditservice.audit.entity.AuditAction;
import az.texnoera.bank.auditservice.audit.entity.AuditStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateAuditLogRequest(

        @NotNull
        UUID userId,

        @NotBlank
        @Size(max = 50)
        String serviceName,

        @NotNull
        AuditAction action,

        @NotBlank
        @Size(max = 50)
        String entityType,

        UUID entityId,

        @Size(max = 1000)
        String description,

        @NotNull
        AuditStatus status,

        @Size(max = 45)
        String ipAddress
) {
}