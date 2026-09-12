package az.texnoera.bank.auditservice.audit.mapper;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {

    AuditLogResponse toResponse(AuditLog auditLog);

    default AuditLog toEntity(CreateAuditLogRequest request) {
        return new AuditLog(
                request.userId(),
                request.serviceName(),
                request.action(),
                request.entityType(),
                request.entityId(),
                request.description(),
                request.status(),
                request.ipAddress()
        );
    }
}