package az.texnoera.bank.auditservice.audit.service.impl;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import az.texnoera.bank.auditservice.audit.exception.AuditLogNotFoundException;
import az.texnoera.bank.auditservice.audit.mapper.AuditLogMapper;
import az.texnoera.bank.auditservice.audit.repository.AuditLogRepository;
import az.texnoera.bank.auditservice.audit.service.AuditLogService;
import az.texnoera.bank.auditservice.audit.specification.AuditLogSpecification;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    @Transactional
    public AuditLogResponse createAuditLog(
            CreateAuditLogRequest request
    ) {

        AuditLog auditLog = auditLogMapper.toEntity(request);

        return auditLogMapper.toResponse(
                auditLogRepository.save(auditLog)
        );
    }

    @Override
    public AuditLogResponse getAuditLogById(
            UUID id
    ) {

        return auditLogMapper.toResponse(
                getEntity(id)
        );
    }

    @Override
    public Page<AuditLogResponse> getAuditLogs(
            UUID userId,
            AuditAction action,
            String serviceName,
            AuditStatus status,
            Pageable pageable
    ) {

        Specification<AuditLog> specification =
                Specification.allOf(
                        AuditLogSpecification.hasUserId(userId),
                        AuditLogSpecification.hasAction(action),
                        AuditLogSpecification.hasServiceName(serviceName),
                        AuditLogSpecification.hasStatus(status)
                );

        return auditLogRepository
                .findAll(specification, pageable)
                .map(auditLogMapper::toResponse);
    }

    private AuditLog getEntity(
            UUID id
    ) {

        return auditLogRepository.findById(id)
                .orElseThrow(
                        () -> new AuditLogNotFoundException(id)
                );
    }
}