package az.texnoera.bank.loanservice.client.dto;

import java.time.LocalDate;
import java.util.UUID;

public record LoanUserLookupResponse(
        UUID id,
        String firstName,
        String lastName,
        String fin,
        LocalDate birthDate
) {
}
