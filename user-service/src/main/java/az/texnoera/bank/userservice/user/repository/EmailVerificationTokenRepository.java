package az.texnoera.bank.userservice.user.repository;

import az.texnoera.bank.userservice.user.entity.EmailVerificationToken;
import az.texnoera.bank.userservice.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationToken, UUID> {

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByUser(User user);
}