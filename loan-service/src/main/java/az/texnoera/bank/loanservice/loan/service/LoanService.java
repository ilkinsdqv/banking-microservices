package az.texnoera.bank.loanservice.loan.service;

import az.texnoera.bank.loanservice.loan.dto.request.CreateLoanRequest;
import az.texnoera.bank.loanservice.loan.dto.response.LoanPaymentResponse;
import az.texnoera.bank.loanservice.loan.dto.response.LoanResponse;

import java.util.List;
import java.util.UUID;

public interface LoanService {

    LoanResponse createLoan(
            UUID userId,
            CreateLoanRequest request
    );

    LoanResponse getLoanById(UUID id);

    List<LoanResponse> getLoansByUserId(UUID userId);

    List<LoanResponse> getLoansByAccountId(UUID accountId);

    LoanResponse approveLoan(UUID id);

    LoanResponse rejectLoan(UUID id);

    LoanResponse activateLoan(UUID id);

    LoanResponse cancelLoan(UUID id);

    LoanResponse makePayment(
            UUID id,
            java.math.BigDecimal amount
    );

    List<LoanPaymentResponse> getPaymentHistory(
            UUID loanId
    );
}