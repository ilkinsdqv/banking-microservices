package az.texnoera.bank.auditservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class InternalServiceAuthenticationFilter extends OncePerRequestFilter {

    private static final String INTERNAL_SERVICE_HEADER =
            "X-Internal-Service-Key";

    private final String internalServiceKey;

    public InternalServiceAuthenticationFilter(
            @Value("${security.internal-service-key}")
            String internalServiceKey
    ) {
        this.internalServiceKey = internalServiceKey;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String providedKey =
                request.getHeader(INTERNAL_SERVICE_HEADER);

        if (providedKey != null
                && providedKey.equals(internalServiceKey)) {

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            "internal-service",
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_INTERNAL_SERVICE"
                                    )
                            )
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}