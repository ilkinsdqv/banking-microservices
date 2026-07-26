CREATE TABLE users
(
    id             UUID PRIMARY KEY,

    first_name     VARCHAR(50)  NOT NULL,
    last_name      VARCHAR(50)  NOT NULL,

    email          VARCHAR(255) NOT NULL UNIQUE,
    password       VARCHAR(255) NOT NULL,

    fin            VARCHAR(7)   NOT NULL UNIQUE,

    phone_number   VARCHAR(20)  NOT NULL,

    birth_date     DATE         NOT NULL,

    email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    account_locked BOOLEAN      NOT NULL DEFAULT FALSE,
    enabled        BOOLEAN      NOT NULL DEFAULT TRUE,

    created_at     TIMESTAMP    NOT NULL,
    updated_at     TIMESTAMP    NOT NULL
);

CREATE TABLE user_roles
(
    user_id UUID        NOT NULL,
    role    VARCHAR(50) NOT NULL,

    PRIMARY KEY (user_id, role),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT chk_user_role
        CHECK (role IN ('CUSTOMER', 'ADMIN'))
);