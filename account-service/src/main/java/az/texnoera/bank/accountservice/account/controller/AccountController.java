package az.texnoera.bank.accountservice.account.controller;

import az.texnoera.bank.accountservice.account.dto.request.BalanceOperationRequest;
import az.texnoera.bank.accountservice.account.dto.request.CreateAccountRequest;
import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;
import az.texnoera.bank.accountservice.account.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AccountResponse> createAccount(
            Authentication authentication,
            HttpServletRequest httpRequest,
            @Valid @RequestBody CreateAccountRequest request
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        accountService.createAccount(
                                userId,
                                request,
                                getClientIpAddress(httpRequest)
                        )
                );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @accountSecurityService.isOwner(authentication, #id)")
    public ResponseEntity<AccountResponse> getAccountById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                accountService.getAccountById(id)
        );
    }

    @GetMapping("/internal/{id}")
    @PreAuthorize("hasRole('INTERNAL_SERVICE')")
    public ResponseEntity<AccountResponse> getAccountByIdInternal(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                accountService.getAccountById(id)
        );
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @accountSecurityService.isCurrentUser(authentication, #userId)")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(
            @PathVariable UUID userId
    ) {
        return ResponseEntity.ok(
                accountService.getAccountsByUserId(userId)
        );
    }

    @PostMapping("/{id}/deposit")
    @PreAuthorize("hasRole('INTERNAL_SERVICE')")
    public ResponseEntity<AccountResponse> deposit(
            @PathVariable UUID id,
            HttpServletRequest httpRequest,
            @Valid @RequestBody BalanceOperationRequest request
    ) {
        return ResponseEntity.ok(
                accountService.deposit(
                        id,
                        request.amount(),
                        getClientIpAddress(httpRequest)
                )
        );
    }

    @PostMapping("/{id}/cash-in")
    @PreAuthorize("@accountSecurityService.isOwner(authentication, #id)")
    public ResponseEntity<AccountResponse> cashIn(
            @PathVariable UUID id,
            Authentication authentication,
            HttpServletRequest httpRequest,
            @Valid @RequestBody BalanceOperationRequest request
    ) {
        return ResponseEntity.ok(
                accountService.cashIn(
                        id,
                        request.amount(),
                        getClientIpAddress(httpRequest)
                )
        );
    }

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('INTERNAL_SERVICE')")
    public ResponseEntity<AccountResponse> withdraw(
            @PathVariable UUID id,
            HttpServletRequest httpRequest,
            @Valid @RequestBody BalanceOperationRequest request
    ) {
        return ResponseEntity.ok(
                accountService.withdraw(
                        id,
                        request.amount(),
                        getClientIpAddress(httpRequest)
                )
        );
    }

    private String getClientIpAddress(HttpServletRequest request) {

        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}