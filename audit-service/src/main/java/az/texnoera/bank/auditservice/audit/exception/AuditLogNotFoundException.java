package az.texnoera.bank.auditservice.audit.exception;

import java.util.UUID;

public class AuditLogNotFoundException extends RuntimeException {

    public AuditLogNotFoundException(UUID id) {
        super("Audit log not found: " + id);
    }
}