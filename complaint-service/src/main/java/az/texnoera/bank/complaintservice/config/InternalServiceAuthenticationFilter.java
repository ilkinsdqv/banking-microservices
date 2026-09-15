package az.texnoera.bank.complaintservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class InternalServiceAuthenticationFilter
        extends OncePerRequestFilter {

    private static final String HEADER =
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
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String providedKey =
                request.getHeader(HEADER);

        if (providedKey != null &&
                providedKey.equals(internalServiceKey)) {

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

            var context =
                    org.springframework.security.core.context
                            .SecurityContextHolder
                            .getContext();

            context.setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}