package az.texnoera.bank.transactionservice.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignSecurityConfig {

    @Value("${security.internal-service-key}")
    private String internalServiceKey;

    @Bean
    public RequestInterceptor internalServiceRequestInterceptor() {
        return requestTemplate -> {

            requestTemplate.header(
                    "X-Internal-Service-Key",
                    internalServiceKey
            );

            ServletRequestAttributes attributes =
                    (ServletRequestAttributes)
                            RequestContextHolder.getRequestAttributes();

            if (attributes == null) {
                return;
            }

            HttpServletRequest request =
                    attributes.getRequest();

            String forwardedFor =
                    request.getHeader("X-Forwarded-For");

            if (forwardedFor != null && !forwardedFor.isBlank()) {
                requestTemplate.header(
                        "X-Forwarded-For",
                        forwardedFor
                );
            }
        };
    }
}