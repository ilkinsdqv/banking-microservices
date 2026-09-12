package az.texnoera.bank.complaintservice.complaint.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResolveComplaintRequest(

        @NotBlank
        @Size(max = 5000)
        String adminResponse
) {
}