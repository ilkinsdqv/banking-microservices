package az.texnoera.bank.complaintservice.audit;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditEvent;
import az.texnoera.bank.common.audit.AuditStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditEventPublisher {

    private static final String TOPIC = "audit-events";

    private final KafkaTemplate<String, AuditEvent> kafkaTemplate;

    public void publish(
            UUID userId,
            AuditAction action,
            String entityType,
            UUID entityId,
            String description,
            AuditStatus status,
            String ipAddress
    ) {

        AuditEvent event = new AuditEvent(
                userId,
                "complaint-service",
                action,
                entityType,
                entityId,
                description,
                status,
                ipAddress,
                LocalDateTime.now()
        );

        kafkaTemplate.send(
                TOPIC,
                entityId != null
                        ? entityId.toString()
                        : userId.toString(),
                event
        );
    }
}