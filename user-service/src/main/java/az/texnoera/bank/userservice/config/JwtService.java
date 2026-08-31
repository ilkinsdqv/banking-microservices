package az.texnoera.bank.userservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final SecretKey jwtSecretKey;

    public Claims extractAllClaims(String token) {

        Jws<Claims> claims = Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token);

        return claims.getPayload();
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(
                extractAllClaims(token).getSubject()
        );
    }

    public List<String> extractRoles(String token) {

        Object roles = extractAllClaims(token).get("roles");

        if (!(roles instanceof List<?> roleList)) {
            return List.of();
        }

        return roleList.stream()
                .map(String::valueOf)
                .toList();
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}