package az.texnoera.bank.auditservice.audit.service;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AuditLogService {

    AuditLogResponse createAuditLog(
            CreateAuditLogRequest request
    );

    AuditLogResponse getAuditLogById(
            UUID id
    );

    Page<AuditLogResponse> getAuditLogs(
            UUID userId,
            AuditAction action,
            String serviceName,
            AuditStatus status,
            Pageable pageable
    );
}