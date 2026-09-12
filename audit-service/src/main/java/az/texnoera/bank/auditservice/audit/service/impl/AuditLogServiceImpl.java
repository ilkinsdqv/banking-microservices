package az.texnoera.bank.auditservice.audit.service.impl;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.auditservice.audit.entity.AuditAction;
import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import az.texnoera.bank.auditservice.audit.exception.AuditLogNotFoundException;
import az.texnoera.bank.auditservice.audit.mapper.AuditLogMapper;
import az.texnoera.bank.auditservice.audit.repository.AuditLogRepository;
import az.texnoera.bank.auditservice.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    @Transactional
    public AuditLogResponse createAuditLog(CreateAuditLogRequest request) {

        AuditLog auditLog = auditLogMapper.toEntity(request);

        return auditLogMapper.toResponse(
                auditLogRepository.save(auditLog)
        );
    }

    @Override
    public AuditLogResponse getAuditLogById(UUID id) {

        return auditLogMapper.toResponse(
                getEntity(id)
        );
    }

    @Override
    public List<AuditLogResponse> getAllAuditLogs() {

        return auditLogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getAuditLogsByUserId(UUID userId) {

        return auditLogRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getAuditLogsByAction(AuditAction action) {

        return auditLogRepository.findAllByActionOrderByCreatedAtDesc(action)
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getAuditLogsByServiceName(String serviceName) {

        return auditLogRepository.findAllByServiceNameOrderByCreatedAtDesc(serviceName)
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    private AuditLog getEntity(UUID id) {

        return auditLogRepository.findById(id)
                .orElseThrow(() -> new AuditLogNotFoundException(id));
    }
}