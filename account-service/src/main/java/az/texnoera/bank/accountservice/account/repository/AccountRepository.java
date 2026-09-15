package az.texnoera.bank.accountservice.account.repository;

import az.texnoera.bank.accountservice.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    List<Account> findAllByUserId(UUID userId);

    boolean existsByIban(String iban);
}