package az.texnoera.bank.auditservice.audit.kafka;

import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import az.texnoera.bank.auditservice.audit.mapper.AuditLogMapper;
import az.texnoera.bank.auditservice.audit.repository.AuditLogRepository;
import az.texnoera.bank.common.audit.AuditEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditEventConsumer {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @KafkaListener(
            topics = "audit-events",
            groupId = "audit-service",
            containerFactory = "auditEventKafkaListenerContainerFactory"
    )
    public void consume(AuditEvent event) {

        log.info(
                "Received audit event: action={}, service={}, entityType={}, entityId={}",
                event.action(),
                event.serviceName(),
                event.entityType(),
                event.entityId()
        );

        AuditLog auditLog = auditLogMapper.toEntity(event);

        auditLogRepository.save(auditLog);

        log.info(
                "Audit event persisted successfully: action={}, entityId={}",
                event.action(),
                event.entityId()
        );
    }
}