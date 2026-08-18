package az.texnoera.bank.userservice.user.entity;

import az.texnoera.bank.common.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "email_verification_tokens",
        indexes = {
                @Index(
                        name = "idx_email_verification_token",
                        columnList = "token"
                ),
                @Index(
                        name = "idx_email_verification_user",
                        columnList = "user_id"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailVerificationToken extends BaseEntity {

    @OneToOne(optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    public EmailVerificationToken(
            User user,
            String token,
            LocalDateTime expiresAt
    ) {
        this.user = user;
        this.token = token;
        this.expiresAt = expiresAt;
        this.used = false;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void markAsUsed() {
        this.used = true;
    }
}