package az.texnoera.bank.auditservice.audit.specification;

import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public final class AuditLogSpecification {

    private AuditLogSpecification() {
    }

    public static Specification<AuditLog> hasUserId(UUID userId) {
        return (root, query, criteriaBuilder) ->
                userId == null
                        ? null
                        : criteriaBuilder.equal(
                        root.get("userId"),
                        userId
                );
    }

    public static Specification<AuditLog> hasAction(
            AuditAction action
    ) {
        return (root, query, criteriaBuilder) ->
                action == null
                        ? null
                        : criteriaBuilder.equal(
                        root.get("action"),
                        action
                );
    }

    public static Specification<AuditLog> hasServiceName(
            String serviceName
    ) {
        return (root, query, criteriaBuilder) ->
                serviceName == null || serviceName.isBlank()
                        ? null
                        : criteriaBuilder.equal(
                        root.get("serviceName"),
                        serviceName
                );
    }

    public static Specification<AuditLog> hasStatus(
            AuditStatus status
    ) {
        return (root, query, criteriaBuilder) ->
                status == null
                        ? null
                        : criteriaBuilder.equal(
                        root.get("status"),
                        status
                );
    }
}