package az.texnoera.bank.loanservice.loan.repository;

import az.texnoera.bank.loanservice.loan.entity.Loan;
import az.texnoera.bank.loanservice.loan.entity.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LoanRepository
        extends JpaRepository<Loan, UUID> {

    List<Loan> findAllByUserId(UUID userId);

    List<Loan> findAllByUserIdAndStatus(
            UUID userId,
            LoanStatus status
    );

    List<Loan> findAllByAccountId(UUID accountId);
}