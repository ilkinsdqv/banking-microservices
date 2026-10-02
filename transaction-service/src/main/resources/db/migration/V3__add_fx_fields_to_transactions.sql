ALTER TABLE transactions
    ADD COLUMN destination_amount NUMERIC(19, 4),
    ADD COLUMN destination_currency VARCHAR(3),
    ADD COLUMN exchange_rate NUMERIC(19, 10);

UPDATE transactions
SET destination_amount = amount,
    destination_currency = currency,
    exchange_rate = 1
WHERE type = 'TRANSFER';