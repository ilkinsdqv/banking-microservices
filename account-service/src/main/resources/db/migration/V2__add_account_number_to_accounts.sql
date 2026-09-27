ALTER TABLE accounts
    ADD COLUMN account_number VARCHAR(16);

DO $$
DECLARE
    account_record RECORD;
    base_number VARCHAR(15);
    digit INTEGER;
    checksum INTEGER;
    check_digit INTEGER;
    double_digit BOOLEAN;
    i INTEGER;
BEGIN
    FOR account_record IN
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS sequence_number
        FROM accounts
        WHERE account_number IS NULL
    LOOP
        base_number := LPAD(account_record.sequence_number::TEXT, 15, '0');
        checksum := 0;
        double_digit := TRUE;

        FOR i IN REVERSE 15..1 LOOP
            digit := SUBSTRING(base_number, i, 1)::INTEGER;

            IF double_digit THEN
                digit := digit * 2;

                IF digit > 9 THEN
                    digit := digit - 9;
                END IF;
            END IF;

            checksum := checksum + digit;
            double_digit := NOT double_digit;
        END LOOP;

        check_digit := (10 - (checksum % 10)) % 10;

        UPDATE accounts
        SET account_number = base_number || check_digit::TEXT
        WHERE id = account_record.id;
    END LOOP;
END $$;

ALTER TABLE accounts
    ALTER COLUMN account_number SET NOT NULL;

ALTER TABLE accounts
    ADD CONSTRAINT uk_accounts_account_number UNIQUE (account_number);
