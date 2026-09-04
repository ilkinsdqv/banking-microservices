CREATE TABLE accounts (
                          id UUID PRIMARY KEY,
                          created_at TIMESTAMP NOT NULL,
                          updated_at TIMESTAMP NOT NULL,

                          user_id UUID NOT NULL,
                          iban VARCHAR(28) NOT NULL UNIQUE,
                          balance NUMERIC(19, 4) NOT NULL,
                          currency VARCHAR(3) NOT NULL,
                          type VARCHAR(20) NOT NULL,

                          CONSTRAINT chk_accounts_balance_non_negative
                              CHECK (balance >= 0),

                          CONSTRAINT chk_accounts_currency
                              CHECK (currency IN ('AZN', 'USD', 'EUR')),

                          CONSTRAINT chk_accounts_type
                              CHECK (type IN ('SAVINGS', 'CHECKING'))
);

CREATE INDEX idx_accounts_user_id
    ON accounts(user_id);