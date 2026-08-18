package az.texnoera.bank.userservice.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateUserRequest(
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        String firstName,
        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        String lastName,
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+994\\d{9}$", message = "Phone number must be in the format +994XXXXXXXXX")
        String phoneNumber
) {
}
