package az.texnoera.bank.loanservice.loan.mapper;

import az.texnoera.bank.loanservice.loan.dto.response.LoanPaymentResponse;
import az.texnoera.bank.loanservice.loan.entity.LoanPayment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LoanPaymentMapper {

    LoanPaymentResponse toResponse(LoanPayment payment);
}