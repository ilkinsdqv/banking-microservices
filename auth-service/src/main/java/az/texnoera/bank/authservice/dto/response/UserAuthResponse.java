package az.texnoera.bank.authservice.dto.response;


import java.util.Set;
import java.util.UUID;

public record UserAuthResponse(
        UUID id,
        String email,
        String password,
        Set<String> roles,
        boolean emailVerified,
        boolean accountLocked,
        boolean enabled
) {
}