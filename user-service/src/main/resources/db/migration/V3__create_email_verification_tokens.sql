CREATE TABLE email_verification_tokens
(
    id         UUID PRIMARY KEY,
    user_id    UUID         NOT NULL UNIQUE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP    NOT NULL,
    used       BOOLEAN      NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_email_verification_token_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

CREATE INDEX idx_email_verification_token
    ON email_verification_tokens (token);

CREATE INDEX idx_email_verification_user
    ON email_verification_tokens (user_id);