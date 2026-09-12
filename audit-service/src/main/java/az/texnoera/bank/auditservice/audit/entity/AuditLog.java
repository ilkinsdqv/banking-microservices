package az.texnoera.bank.auditservice.audit.entity;

import az.texnoera.bank.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AuditLog extends BaseEntity {

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 50)
    private String serviceName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AuditAction action;

    @Column(nullable = false, length = 50)
    private String entityType;

    @Column
    private UUID entityId;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuditStatus status;

    @Column(length = 45)
    private String ipAddress;

    public AuditLog(
            UUID userId,
            String serviceName,
            AuditAction action,
            String entityType,
            UUID entityId,
            String description,
            AuditStatus status,
            String ipAddress
    ) {
        this.userId = userId;
        this.serviceName = serviceName;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
        this.status = status;
        this.ipAddress = ipAddress;
    }
}