package az.texnoera.bank.common.audit;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditEvent(
        UUID userId,
        String serviceName,
        AuditAction action,
        String entityType,
        UUID entityId,
        String description,
        AuditStatus status,
        String ipAddress,
        LocalDateTime occurredAt
) {
}