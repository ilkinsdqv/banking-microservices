package az.texnoera.bank.authservice.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SECRET =
            "0123456789012345678901234567890123456789012345678901234567890123";

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret(SECRET);
        properties.setAccessTokenExpiration(900_000);
        jwtService = new JwtService(properties);
    }

    @Test
    void shouldGenerateValidAccessTokenWithUserIdAndRoles() {
        UUID userId = UUID.randomUUID();

        String token = jwtService.generateAccessToken(
                userId,
                Set.of("CUSTOMER", "ADMIN")
        );

        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractUserId(token)).isEqualTo(userId);
        assertThat(jwtService.extractRoles(token))
                .containsExactlyInAnyOrder("CUSTOMER", "ADMIN");
    }

    @Test
    void shouldRejectTokenWithInvalidSignature() {
        String token = Jwts.builder()
                .subject(UUID.randomUUID().toString())
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(Keys.hmacShaKeyFor(
                        "different-secret-different-secret-different-secret-1234"
                                .getBytes(StandardCharsets.UTF_8)
                ))
                .compact();

        assertThat(jwtService.isTokenValid(token)).isFalse();
    }

    @Test
    void shouldRejectExpiredToken() {
        String token = Jwts.builder()
                .subject(UUID.randomUUID().toString())
                .expiration(new Date(System.currentTimeMillis() - 1_000))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();

        assertThat(jwtService.isTokenValid(token)).isFalse();
    }
}
