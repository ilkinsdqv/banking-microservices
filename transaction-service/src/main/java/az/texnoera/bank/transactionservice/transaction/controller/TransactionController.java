package az.texnoera.bank.transactionservice.transaction.controller;

import az.texnoera.bank.transactionservice.transaction.dto.request.CreateTransactionRequest;
import az.texnoera.bank.transactionservice.transaction.dto.response.TransactionResponse;
import az.texnoera.bank.transactionservice.transaction.service.TransactionService;
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
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            Authentication authentication,
            @Valid @RequestBody CreateTransactionRequest request
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        transactionService.createTransaction(
                                userId,
                                request
                        )
                );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@transactionSecurityService.isOwner(authentication, #id)"
    )
    public ResponseEntity<TransactionResponse> getTransactionById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                transactionService.getTransactionById(id)
        );
    }

    @GetMapping("/account/{accountId}")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@transactionSecurityService.isAccountOwner(authentication, #accountId)"
    )
    public ResponseEntity<List<TransactionResponse>>
    getTransactionsByAccountId(
            @PathVariable UUID accountId
    ) {
        return ResponseEntity.ok(
                transactionService.getTransactionsByAccountId(
                        accountId
                )
        );
    }
}