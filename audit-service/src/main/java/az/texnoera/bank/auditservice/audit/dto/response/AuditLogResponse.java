package az.texnoera.bank.auditservice.audit.dto.response;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        UUID userId,
        String serviceName,
        AuditAction action,
        String entityType,
        UUID entityId,
        String description,
        AuditStatus status,
        String ipAddress,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}