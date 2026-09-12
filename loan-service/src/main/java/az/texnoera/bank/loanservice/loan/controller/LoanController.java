package az.texnoera.bank.loanservice.loan.controller;

import az.texnoera.bank.loanservice.loan.dto.request.CreateLoanRequest;
import az.texnoera.bank.loanservice.loan.dto.response.LoanPaymentResponse;
import az.texnoera.bank.loanservice.loan.dto.response.LoanResponse;
import az.texnoera.bank.loanservice.loan.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<LoanResponse> createLoan(
            Authentication authentication,
            @Valid @RequestBody CreateLoanRequest request
    ) {

        UUID userId = (UUID) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        loanService.createLoan(
                                userId,
                                request
                        )
                );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@loanSecurityService.isOwner(authentication, #id)"
    )
    public ResponseEntity<LoanResponse> getLoanById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                loanService.getLoanById(id)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<LoanResponse>> getMyLoans(
            Authentication authentication
    ) {

        UUID userId = (UUID) authentication.getPrincipal();

        return ResponseEntity.ok(
                loanService.getLoansByUserId(userId)
        );
    }

    @GetMapping("/account/{accountId}")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@loanSecurityService.isAccountOwner(authentication, #accountId)"
    )
    public ResponseEntity<List<LoanResponse>> getLoansByAccountId(
            @PathVariable UUID accountId
    ) {

        return ResponseEntity.ok(
                loanService.getLoansByAccountId(accountId)
        );
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanResponse> approveLoan(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                loanService.approveLoan(id)
        );
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanResponse> rejectLoan(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                loanService.rejectLoan(id)
        );
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanResponse> activateLoan(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                loanService.activateLoan(id)
        );
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@loanSecurityService.isOwner(authentication, #id)"
    )
    public ResponseEntity<LoanResponse> cancelLoan(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                loanService.cancelLoan(id)
        );
    }

    @PostMapping("/{id}/payment")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@loanSecurityService.isOwner(authentication, #id)"
    )
    public ResponseEntity<LoanResponse> makePayment(
            @PathVariable UUID id,
            @RequestParam BigDecimal amount
    ) {

        return ResponseEntity.ok(
                loanService.makePayment(
                        id,
                        amount
                )
        );
    }

    @GetMapping("/{id}/payments")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@loanSecurityService.isOwner(authentication, #id)"
    )
    public ResponseEntity<List<LoanPaymentResponse>> getPaymentHistory(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                loanService.getPaymentHistory(id)
        );
    }
}