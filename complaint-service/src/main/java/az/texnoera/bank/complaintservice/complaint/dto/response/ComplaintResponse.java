package az.texnoera.bank.complaintservice.complaint.dto.response;

import az.texnoera.bank.complaintservice.complaint.entity.ComplaintPriority;
import az.texnoera.bank.complaintservice.complaint.entity.ComplaintStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ComplaintResponse(
        UUID id,
        UUID userId,
        String subject,
        String description,
        ComplaintStatus status,
        ComplaintPriority priority,
        String adminResponse,
        LocalDateTime resolvedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}