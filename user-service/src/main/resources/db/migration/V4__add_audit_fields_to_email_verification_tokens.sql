ALTER TABLE email_verification_tokens
    ADD COLUMN created_at TIMESTAMP;

ALTER TABLE email_verification_tokens
    ADD COLUMN updated_at TIMESTAMP;