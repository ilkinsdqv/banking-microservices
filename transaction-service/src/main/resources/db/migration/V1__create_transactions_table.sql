CREATE TABLE transactions
(
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP      NOT NULL,
    updated_at      TIMESTAMP      NOT NULL,

    from_account_id UUID,
    to_account_id   UUID,

    amount          NUMERIC(19, 4) NOT NULL,
    currency        VARCHAR(3)     NOT NULL,
    type            VARCHAR(20)    NOT NULL,
    status          VARCHAR(20)    NOT NULL,
    description     VARCHAR(500),

    CONSTRAINT chk_transactions_amount_positive
        CHECK (amount > 0),

    CONSTRAINT chk_transactions_currency
        CHECK (currency IN ('AZN', 'USD', 'EUR')),

    CONSTRAINT chk_transactions_type
        CHECK (type IN ('DEPOSIT', 'WITHDRAW', 'TRANSFER')),

    CONSTRAINT chk_transactions_status
        CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),

    CONSTRAINT chk_transactions_accounts
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
            )
);

CREATE INDEX idx_transactions_from_account_id
    ON transactions (from_account_id);

CREATE INDEX idx_transactions_to_account_id
    ON transactions (to_account_id);

CREATE INDEX idx_transactions_created_at
    ON transactions (created_at);