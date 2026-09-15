package az.texnoera.bank.loanservice.loan.mapper;

import az.texnoera.bank.loanservice.loan.dto.response.LoanResponse;
import az.texnoera.bank.loanservice.loan.entity.Loan;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LoanMapper {

    LoanResponse toResponse(Loan loan);
}