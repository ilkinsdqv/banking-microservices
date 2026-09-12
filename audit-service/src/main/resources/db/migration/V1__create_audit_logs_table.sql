CREATE TABLE audit_logs
(
    id           UUID PRIMARY KEY,
    created_at   TIMESTAMP   NOT NULL,
    updated_at   TIMESTAMP   NOT NULL,

    user_id      UUID        NOT NULL,
    service_name VARCHAR(50) NOT NULL,
    action       VARCHAR(50) NOT NULL,
    entity_type  VARCHAR(50) NOT NULL,
    entity_id    UUID,
    description  VARCHAR(1000),
    status       VARCHAR(20) NOT NULL,
    ip_address   VARCHAR(45),

    CONSTRAINT chk_audit_logs_status
        CHECK (status IN ('SUCCESS', 'FAILED'))
);

CREATE INDEX idx_audit_logs_user_id
    ON audit_logs (user_id);

CREATE INDEX idx_audit_logs_action
    ON audit_logs (action);

CREATE INDEX idx_audit_logs_service_name
    ON audit_logs (service_name);

CREATE INDEX idx_audit_logs_created_at
    ON audit_logs (created_at DESC);