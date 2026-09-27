ALTER TABLE loan_payments
    ADD COLUMN payment_account_id UUID;

UPDATE loan_payments lp
SET payment_account_id = l.account_id
FROM loans l
WHERE lp.loan_id = l.id;

ALTER TABLE loan_payments
    ALTER COLUMN payment_account_id SET NOT NULL;

CREATE INDEX idx_loan_payments_payment_account_id
    ON loan_payments (payment_account_id);
