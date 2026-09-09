package az.texnoera.bank.accountservice.config;

import az.texnoera.bank.accountservice.account.entity.Account;
import az.texnoera.bank.accountservice.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("accountSecurityService")
@RequiredArgsConstructor
public class AccountSecurityService {

    private final AccountRepository accountRepository;

    public boolean isOwner(
            Authentication authentication,
            UUID accountId
    ) {

        if (authentication == null) {
            return false;
        }

        UUID currentUserId = extractUserId(authentication);


        if (currentUserId == null) {
            return false;
        }

        Account account = accountRepository.findById(accountId)
                .orElse(null);

        if (account == null) {
            return false;
        }
        return currentUserId.equals(account.getUserId());
    }

    public boolean isCurrentUser(
            Authentication authentication,
            UUID userId
    ) {
        UUID currentUserId = extractUserId(authentication);

        return currentUserId != null
                && currentUserId.equals(userId);
    }

    private UUID extractUserId(Authentication authentication) {

        Object principal = authentication.getPrincipal();

        if (principal instanceof UUID userId) {
            return userId;
        }

        if (principal instanceof String userId) {
            try {
                return UUID.fromString(userId);
            } catch (IllegalArgumentException ignored) {
                return null;
            }
        }

        return null;
    }
}