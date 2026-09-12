package az.texnoera.bank.loanservice.config;

import az.texnoera.bank.loanservice.loan.entity.Loan;
import az.texnoera.bank.loanservice.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("loanSecurityService")
@RequiredArgsConstructor
public class LoanSecurityService {

    private final LoanRepository loanRepository;

    public boolean isOwner(
            Authentication authentication,
            UUID loanId
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID currentUserId)) {
            return false;
        }

        return loanRepository.findById(loanId)
                .map(Loan::getUserId)
                .map(currentUserId::equals)
                .orElse(false);
    }

    public boolean isAccountOwner(
            Authentication authentication,
            UUID accountId
    ) {

        // Account ownership will be validated through
        // LoanService business logic.
        return authentication != null &&
                authentication.isAuthenticated();
    }
}