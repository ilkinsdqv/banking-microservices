package az.texnoera.bank.userservice.user.repository;

import az.texnoera.bank.userservice.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail(String email);
    boolean existsByFin(String fin);
    Optional<User> findByEmail(String email);
    Optional<User> findByFin(String fin);
    Optional<User> findByFinAndBirthDate(String fin, LocalDate birthDate);
    Optional<User> findByEmailOrFin(String email, String fin);
}
