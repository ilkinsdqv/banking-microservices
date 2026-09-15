CREATE TABLE loans
(
    id               UUID PRIMARY KEY,
    created_at       TIMESTAMP      NOT NULL,
    updated_at       TIMESTAMP      NOT NULL,

    user_id          UUID           NOT NULL,
    account_id       UUID           NOT NULL,

    principal_amount NUMERIC(19, 4) NOT NULL,
    interest_rate    NUMERIC(5, 2)  NOT NULL,
    term_months      INTEGER        NOT NULL,
    monthly_payment  NUMERIC(19, 4) NOT NULL,
    remaining_amount NUMERIC(19, 4) NOT NULL,

    currency         VARCHAR(3)     NOT NULL,
    status           VARCHAR(20)    NOT NULL,

    CONSTRAINT chk_loans_principal_amount_positive
        CHECK (principal_amount > 0),

    CONSTRAINT chk_loans_interest_rate_non_negative
        CHECK (interest_rate >= 0),

    CONSTRAINT chk_loans_term_months_positive
        CHECK (term_months > 0),

    CONSTRAINT chk_loans_monthly_payment_positive
        CHECK (monthly_payment > 0),

    CONSTRAINT chk_loans_remaining_amount_non_negative
        CHECK (remaining_amount >= 0),

    CONSTRAINT chk_loans_remaining_not_exceed_principal
        CHECK (remaining_amount <= principal_amount),

    CONSTRAINT chk_loans_currency
        CHECK (currency IN ('AZN', 'USD', 'EUR')),

    CONSTRAINT chk_loans_status
        CHECK (
            status IN (
                       'PENDING',
                       'APPROVED',
                       'REJECTED',
                       'ACTIVE',
                       'PAID',
                       'DEFAULTED',
                       'CANCELLED'
                )
            )
);

CREATE INDEX idx_loans_user_id
    ON loans (user_id);

CREATE INDEX idx_loans_account_id
    ON loans (account_id);

CREATE INDEX idx_loans_status
    ON loans (status);