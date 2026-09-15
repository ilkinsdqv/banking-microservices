package az.texnoera.bank.loanservice.client;

import az.texnoera.bank.loanservice.client.dto.CreateLoanDisbursementRequest;
import az.texnoera.bank.loanservice.client.dto.CreateLoanPaymentRequest;
import az.texnoera.bank.loanservice.client.dto.TransactionResponse;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Component
public class TransactionClientFallbackFactory
        implements FallbackFactory<TransactionClient> {

    @Override
    public TransactionClient create(Throwable cause) {

        return new TransactionClient() {

            @Override
            public TransactionResponse createLoanPayment(
                    CreateLoanPaymentRequest request
            ) {

                throw new IllegalStateException(
                        "Transaction Service is temporarily unavailable",
                        cause
                );
            }

            @Override
            public TransactionResponse createLoanDisbursement(
                    CreateLoanDisbursementRequest request
            ) {

                throw new IllegalStateException(
                        "Transaction Service is temporarily unavailable",
                        cause
                );
            }
        };
    }
}