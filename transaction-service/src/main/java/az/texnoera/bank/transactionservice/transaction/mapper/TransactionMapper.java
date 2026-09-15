package az.texnoera.bank.transactionservice.transaction.mapper;

import az.texnoera.bank.transactionservice.transaction.dto.response.TransactionResponse;
import az.texnoera.bank.transactionservice.transaction.entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    TransactionResponse toResponse(Transaction transaction);
}