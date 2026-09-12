package az.texnoera.bank.loanservice.config;

import az.texnoera.bank.loanservice.client.AccountClient;
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
    private final AccountClient accountClient;

    public boolean isOwner(
            Authentication authentication,
            UUID loanId
    ) {
        UUID currentUserId = getCurrentUserId(authentication);

        if (currentUserId == null) {
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
        UUID currentUserId = getCurrentUserId(authentication);

        if (currentUserId == null) {
            return false;
        }

        try {
            return currentUserId.equals(
                    accountClient
                            .getAccountById(accountId)
                            .userId()
            );
        } catch (Exception e) {
            return false;
        }
    }

    private UUID getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID currentUserId)) {
            return null;
        }

        return currentUserId;
    }
}