package az.texnoera.bank.complaintservice.complaint.dto.request;

import az.texnoera.bank.complaintservice.complaint.entity.ComplaintPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateComplaintRequest(

        @NotBlank
        @Size(max = 200)
        String subject,

        @NotBlank
        @Size(max = 5000)
        String description,

        @NotNull
        ComplaintPriority priority
) {
}