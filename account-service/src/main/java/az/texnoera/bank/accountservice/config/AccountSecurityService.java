package az.texnoera.bank.accountservice.config;

import az.texnoera.bank.accountservice.account.entity.Account;
import az.texnoera.bank.accountservice.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AccountSecurityService {

    private final AccountRepository accountRepository;

    public boolean isOwner(
            Authentication authentication,
            UUID accountId
    ) {
        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID currentUserId)) {
            return false;
        }

        return accountRepository.findById(accountId)
                .map(Account::getUserId)
                .map(currentUserId::equals)
                .orElse(false);
    }

    public boolean isCurrentUser(
            Authentication authentication,
            UUID userId
    ) {
        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID currentUserId)) {
            return false;
        }

        return currentUserId.equals(userId);
    }
}