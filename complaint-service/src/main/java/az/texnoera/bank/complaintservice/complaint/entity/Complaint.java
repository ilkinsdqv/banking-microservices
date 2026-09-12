package az.texnoera.bank.complaintservice.complaint.entity;

import az.texnoera.bank.common.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "complaints")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Complaint extends BaseEntity {

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, length = 5000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ComplaintStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ComplaintPriority priority;

    @Column(length = 5000)
    private String adminResponse;

    private LocalDateTime resolvedAt;

    public Complaint(
            UUID userId,
            String subject,
            String description,
            ComplaintPriority priority
    ) {
        this.userId = userId;
        this.subject = subject;
        this.description = description;
        this.priority = priority;
        this.status = ComplaintStatus.OPEN;
    }

    public void startProcessing() {
        if (status != ComplaintStatus.OPEN) {
            throw new IllegalStateException(
                    "Only open complaints can be moved to in-progress"
            );
        }

        status = ComplaintStatus.IN_PROGRESS;
    }

    public void resolve(String adminResponse) {
        if (status != ComplaintStatus.IN_PROGRESS) {
            throw new IllegalStateException(
                    "Only in-progress complaints can be resolved"
            );
        }

        this.adminResponse = adminResponse;
        this.status = ComplaintStatus.RESOLVED;
        this.resolvedAt = LocalDateTime.now();
    }

    public void close() {
        if (status != ComplaintStatus.RESOLVED) {
            throw new IllegalStateException(
                    "Only resolved complaints can be closed"
            );
        }

        status = ComplaintStatus.CLOSED;
    }
}