package az.texnoera.bank.userservice.user.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateUserRequest(
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        String firstName,
        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        String lastName,
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        @Size(max = 255, message = "Email must be less than 255 characters")
        String email,
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        String password,
        @NotBlank(message = "FIN is required")
        @Pattern(regexp = "^[A-Z0-9]{7}$", message = "FIN must be 7 characters long and contain only uppercase letters and digits")
        String fin,
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+994\\d{9}$", message = "Phone number must be in the format +994XXXXXXXXX")
        String phoneNumber,
        @NotNull(message = "Birth date is required")
        @Past(message = "Birth date must be in the past")
        LocalDate birthDate
) {
}
