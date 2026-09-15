package az.texnoera.bank.transactionservice.transaction.repository;

import az.texnoera.bank.transactionservice.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository
        extends JpaRepository<Transaction, UUID> {

    List<Transaction> findAllByFromAccountId(UUID accountId);

    List<Transaction> findAllByToAccountId(UUID accountId);

    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.fromAccountId = :accountId
               OR t.toAccountId = :accountId
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findAllByAccountId(UUID accountId);
}