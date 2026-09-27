package az.texnoera.bank.loanservice.loan.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CustomerLoanResponse(
        UUID userId,
        String firstName,
        String lastName,
        String fin,
        LocalDate birthDate,
        List<LoanResponse> loans
) {
}
