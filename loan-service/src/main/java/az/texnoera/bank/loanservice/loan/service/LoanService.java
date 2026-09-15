package az.texnoera.bank.loanservice.loan.service;

import az.texnoera.bank.loanservice.loan.dto.request.CreateLoanRequest;
import az.texnoera.bank.loanservice.loan.dto.response.LoanPaymentResponse;
import az.texnoera.bank.loanservice.loan.dto.response.LoanResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface LoanService {

    LoanResponse createLoan(
            UUID userId,
            CreateLoanRequest request,
            String ipAddress
    );

    LoanResponse getLoanById(UUID id);

    List<LoanResponse> getLoansByUserId(UUID userId);

    List<LoanResponse> getLoansByAccountId(UUID accountId);

    LoanResponse approveLoan(UUID id, String ipAddress);

    LoanResponse rejectLoan(UUID id, String ipAddress);

    LoanResponse activateLoan(UUID id, String ipAddress);

    LoanResponse cancelLoan(UUID id, String ipAddress);

    LoanResponse makePayment(
            UUID id,
            BigDecimal amount,
            String ipAddress
    );

    List<LoanPaymentResponse> getPaymentHistory(UUID loanId);
}