package az.texnoera.bank.accountservice.account.mapper;

import az.texnoera.bank.accountservice.account.dto.response.AccountResponse;
import az.texnoera.bank.accountservice.account.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    AccountResponse toResponse(Account account);
}