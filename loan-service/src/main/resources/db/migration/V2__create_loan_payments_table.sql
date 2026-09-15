CREATE TABLE loan_payments
(
    id               UUID PRIMARY KEY,
    created_at       TIMESTAMP      NOT NULL,
    updated_at       TIMESTAMP      NOT NULL,

    loan_id          UUID           NOT NULL,
    amount           NUMERIC(19, 4) NOT NULL,
    remaining_amount NUMERIC(19, 4) NOT NULL,
    status           VARCHAR(20)    NOT NULL,

    CONSTRAINT chk_loan_payments_amount_positive
        CHECK (amount > 0),

    CONSTRAINT chk_loan_payments_remaining_non_negative
        CHECK (remaining_amount >= 0),

    CONSTRAINT chk_loan_payments_status
        CHECK (status IN ('COMPLETED', 'FAILED'))
);

CREATE INDEX idx_loan_payments_loan_id
    ON loan_payments (loan_id);

CREATE INDEX idx_loan_payments_created_at
    ON loan_payments (created_at);