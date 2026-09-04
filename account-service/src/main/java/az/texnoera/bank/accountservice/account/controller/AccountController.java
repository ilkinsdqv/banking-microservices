package az.texnoera.bank.accountservice.account.controller;

import az.texnoera.bank.accountservice.account.dto.request.CreateAccountRequest;
import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;
import az.texnoera.bank.accountservice.account.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody CreateAccountRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(accountService.createAccount(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                accountService.getAccountById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(
            @PathVariable UUID userId
    ) {
        return ResponseEntity.ok(
                accountService.getAccountsByUserId(userId)
        );
    }
}