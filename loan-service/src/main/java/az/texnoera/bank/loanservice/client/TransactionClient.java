package az.texnoera.bank.loanservice.client;

import az.texnoera.bank.loanservice.client.dto.CreateLoanPaymentRequest;
import az.texnoera.bank.loanservice.client.dto.CreateLoanDisbursementRequest;
import az.texnoera.bank.loanservice.client.dto.TransactionResponse;
import az.texnoera.bank.loanservice.config.FeignSecurityConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "transaction-service",
        configuration = FeignSecurityConfig.class,
        fallbackFactory = TransactionClientFallbackFactory.class
)
public interface TransactionClient {

    @PostMapping("/api/v1/transactions/internal/loan-payment")
    TransactionResponse createLoanPayment(
            @RequestBody CreateLoanPaymentRequest request
    );

    @PostMapping("/api/v1/transactions/internal/loan-disbursement")
    TransactionResponse createLoanDisbursement(
            @RequestBody CreateLoanDisbursementRequest request
    );
}