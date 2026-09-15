package az.texnoera.bank.loanservice.loan.repository;

import az.texnoera.bank.loanservice.loan.entity.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LoanPaymentRepository
        extends JpaRepository<LoanPayment, UUID> {

    List<LoanPayment> findAllByLoanIdOrderByCreatedAtDesc(
            UUID loanId
    );
}