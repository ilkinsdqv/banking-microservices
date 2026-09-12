package az.texnoera.bank.auditservice.audit.repository;

import az.texnoera.bank.auditservice.audit.entity.AuditAction;
import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    List<AuditLog> findAllByActionOrderByCreatedAtDesc(AuditAction action);

    List<AuditLog> findAllByServiceNameOrderByCreatedAtDesc(String serviceName);

    List<AuditLog> findAllByOrderByCreatedAtDesc();
}