package az.texnoera.bank.auditservice.audit.service;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.common.audit.AuditAction;

import java.util.List;
import java.util.UUID;

public interface AuditLogService {

    AuditLogResponse createAuditLog(CreateAuditLogRequest request);

    AuditLogResponse getAuditLogById(UUID id);

    List<AuditLogResponse> getAllAuditLogs();

    List<AuditLogResponse> getAuditLogsByUserId(UUID userId);

    List<AuditLogResponse> getAuditLogsByAction(AuditAction action);

    List<AuditLogResponse> getAuditLogsByServiceName(String serviceName);
}