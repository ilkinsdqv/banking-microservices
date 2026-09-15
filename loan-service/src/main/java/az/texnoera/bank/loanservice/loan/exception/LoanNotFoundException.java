package az.texnoera.bank.loanservice.loan.exception;

import java.util.UUID;

public class LoanNotFoundException
        extends RuntimeException {

    public LoanNotFoundException(UUID loanId) {
        super("Loan not found with id: " + loanId);
    }
}