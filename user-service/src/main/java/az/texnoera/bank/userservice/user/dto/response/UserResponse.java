package az.texnoera.bank.userservice.user.dto.response;

import az.texnoera.bank.userservice.user.enums.Role;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String fin,
        String phoneNumber,
        LocalDate birthDate,
        Set<Role> roles,
        boolean emailVerified,
        boolean accountLocked,
        boolean enabled) {
}
