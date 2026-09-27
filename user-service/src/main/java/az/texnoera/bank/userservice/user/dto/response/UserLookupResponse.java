package az.texnoera.bank.userservice.user.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record UserLookupResponse(
        UUID id,
        String firstName,
        String lastName,
        String fin,
        LocalDate birthDate
) {
}
