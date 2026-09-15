ALTER TABLE transactions
DROP
CONSTRAINT chk_transactions_type;

ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_type
        CHECK (
            type IN (
                     'DEPOSIT',
                     'WITHDRAW',
                     'TRANSFER',
                     'LOAN_DISBURSEMENT'
                )
            );

ALTER TABLE transactions
DROP
CONSTRAINT chk_transactions_accounts;

ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_accounts
        CHECK (
            (type = 'DEPOSIT'
                AND from_account_id IS NULL
                AND to_account_id IS NOT NULL)
                OR
            (type = 'WITHDRAW'
                AND from_account_id IS NOT NULL
                AND to_account_id IS NULL)
                OR
            (type = 'TRANSFER'
                AND from_account_id IS NOT NULL
                AND to_account_id IS NOT NULL
                AND from_account_id <> to_account_id)
                OR
            (type = 'LOAN_DISBURSEMENT'
                AND from_account_id IS NULL
                AND to_account_id IS NOT NULL)
            );