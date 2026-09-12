package az.texnoera.bank.loanservice.loan.service.impl;

import az.texnoera.bank.loanservice.client.AccountClient;
import az.texnoera.bank.loanservice.client.dto.AccountResponse;
import az.texnoera.bank.loanservice.loan.dto.request.BalanceOperationRequest;
import az.texnoera.bank.loanservice.loan.dto.request.CreateLoanRequest;
import az.texnoera.bank.loanservice.loan.dto.response.LoanResponse;
import az.texnoera.bank.loanservice.loan.entity.Loan;
import az.texnoera.bank.loanservice.loan.entity.LoanStatus;
import az.texnoera.bank.loanservice.loan.exception.LoanNotFoundException;
import az.texnoera.bank.loanservice.loan.mapper.LoanMapper;
import az.texnoera.bank.loanservice.loan.repository.LoanRepository;
import az.texnoera.bank.loanservice.loan.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final LoanMapper loanMapper;
    private final AccountClient accountClient;

    @Override
    @Transactional
    public LoanResponse createLoan(
            UUID userId,
            CreateLoanRequest request
    ) {

        AccountResponse account =
                accountClient.getAccountById(
                        request.accountId()
                );

        validateAccountOwner(account, userId);
        validateCurrency(
                account,
                request.currency().name()
        );

        BigDecimal monthlyPayment =
                calculateMonthlyPayment(
                        request.principalAmount(),
                        request.interestRate(),
                        request.termMonths()
                );

        Loan loan = new Loan(
                userId,
                account.id(),
                request.principalAmount(),
                request.interestRate(),
                request.termMonths(),
                monthlyPayment,
                request.principalAmount(),
                request.currency(),
                LoanStatus.PENDING
        );

        return loanMapper.toResponse(
                loanRepository.save(loan)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public LoanResponse getLoanById(UUID id) {

        return loanRepository.findById(id)
                .map(loanMapper::toResponse)
                .orElseThrow(() ->
                        new LoanNotFoundException(id)
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoanResponse> getLoansByUserId(
            UUID userId
    ) {

        return loanRepository.findAllByUserId(userId)
                .stream()
                .map(loanMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoanResponse> getLoansByAccountId(
            UUID accountId
    ) {

        return loanRepository.findAllByAccountId(accountId)
                .stream()
                .map(loanMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public LoanResponse approveLoan(UUID id) {

        Loan loan = getEntity(id);

        loan.approve();

        return loanMapper.toResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse rejectLoan(UUID id) {

        Loan loan = getEntity(id);

        loan.reject();

        return loanMapper.toResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse activateLoan(UUID id) {

        Loan loan = getEntity(id);

        AccountResponse account =
                accountClient.getAccountById(
                        loan.getAccountId()
                );

        validateCurrency(
                account,
                loan.getCurrency().name()
        );

        accountClient.deposit(
                loan.getAccountId(),
                new BalanceOperationRequest(
                        loan.getPrincipalAmount()
                )
        );

        loan.activate();

        return loanMapper.toResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse cancelLoan(UUID id) {

        Loan loan = getEntity(id);

        loan.cancel();

        return loanMapper.toResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse makePayment(
            UUID id,
            BigDecimal amount
    ) {

        Loan loan = getEntity(id);

        loan.makePayment(amount);

        return loanMapper.toResponse(loan);
    }

    private Loan getEntity(UUID id) {

        return loanRepository.findById(id)
                .orElseThrow(() ->
                        new LoanNotFoundException(id)
                );
    }

    private void validateAccountOwner(
            AccountResponse account,
            UUID userId
    ) {

        if (!account.userId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Account does not belong to current user"
            );
        }
    }

    private void validateCurrency(
            AccountResponse account,
            String currency
    ) {

        if (!account.currency().equals(currency)) {
            throw new IllegalArgumentException(
                    "Account currency does not match loan currency"
            );
        }
    }

    private BigDecimal calculateMonthlyPayment(
            BigDecimal principal,
            BigDecimal annualInterestRate,
            int termMonths
    ) {

        if (annualInterestRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal
                    .divide(
                            BigDecimal.valueOf(termMonths),
                            4,
                            RoundingMode.HALF_UP
                    );
        }

        BigDecimal monthlyRate =
                annualInterestRate
                        .divide(
                                BigDecimal.valueOf(1200),
                                10,
                                RoundingMode.HALF_UP
                        );

        double rate = monthlyRate.doubleValue();

        double principalValue = principal.doubleValue();

        double factor =
                Math.pow(1 + rate, termMonths);

        double payment =
                principalValue *
                        rate *
                        factor /
                        (factor - 1);

        return BigDecimal
                .valueOf(payment)
                .setScale(
                        4,
                        RoundingMode.HALF_UP
                );
    }
}