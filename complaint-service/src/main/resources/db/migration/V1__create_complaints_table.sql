CREATE TABLE complaints
(
    id             UUID PRIMARY KEY,
    created_at     TIMESTAMP     NOT NULL,
    updated_at     TIMESTAMP     NOT NULL,

    user_id        UUID          NOT NULL,

    subject        VARCHAR(200)  NOT NULL,
    description    VARCHAR(5000) NOT NULL,

    status         VARCHAR(20)   NOT NULL,
    priority       VARCHAR(20)   NOT NULL,

    admin_response VARCHAR(5000),

    resolved_at    TIMESTAMP,

    CONSTRAINT chk_complaints_status
        CHECK (
            status IN (
                       'OPEN',
                       'IN_PROGRESS',
                       'RESOLVED',
                       'CLOSED'
                )
            ),

    CONSTRAINT chk_complaints_priority
        CHECK (
            priority IN (
                         'LOW',
                         'MEDIUM',
                         'HIGH'
                )
            )
);

CREATE INDEX idx_complaints_user_id
    ON complaints (user_id);

CREATE INDEX idx_complaints_status
    ON complaints (status);

CREATE INDEX idx_complaints_created_at
    ON complaints (created_at);