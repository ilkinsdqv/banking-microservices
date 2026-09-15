package az.texnoera.bank.loanservice.client;

import az.texnoera.bank.loanservice.client.dto.CreateLoanDisbursementRequest;
import az.texnoera.bank.loanservice.client.dto.CreateLoanPaymentRequest;
import az.texnoera.bank.loanservice.client.dto.TransactionResponse;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionServiceClient {

    private static final String CREATE_LOAN_PAYMENT =
            "TransactionClientcreateLoanPaymentCreateLoanPaymentRequest";

    private static final String CREATE_LOAN_DISBURSEMENT =
            "TransactionClientcreateLoanDisbursementCreateLoanDisbursementRequest";

    private final TransactionClient transactionClient;

    @Retry(name = CREATE_LOAN_PAYMENT)
    @Bulkhead(
            name = CREATE_LOAN_PAYMENT,
            type = Bulkhead.Type.SEMAPHORE
    )
    public TransactionResponse createLoanPayment(
            CreateLoanPaymentRequest request
    ) {
        return transactionClient.createLoanPayment(request);
    }

    @Retry(name = CREATE_LOAN_DISBURSEMENT)
    @Bulkhead(
            name = CREATE_LOAN_DISBURSEMENT,
            type = Bulkhead.Type.SEMAPHORE
    )
    public TransactionResponse createLoanDisbursement(
            CreateLoanDisbursementRequest request
    ) {
        return transactionClient.createLoanDisbursement(request);
    }
}