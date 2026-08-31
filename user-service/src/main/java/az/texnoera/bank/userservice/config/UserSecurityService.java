package az.texnoera.bank.userservice.config;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserSecurityService {

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