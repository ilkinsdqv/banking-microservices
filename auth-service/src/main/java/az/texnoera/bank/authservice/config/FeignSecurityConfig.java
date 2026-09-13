package az.texnoera.bank.authservice.config;

import feign.RequestInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class FeignSecurityConfig {

    @Value("${security.internal-service-key}")
    private String internalServiceKey;

    @Bean
    public RequestInterceptor internalServiceRequestInterceptor() {
        return requestTemplate ->
                requestTemplate.header(
                        "X-Internal-Service-Key",
                        internalServiceKey
                );
    }
}