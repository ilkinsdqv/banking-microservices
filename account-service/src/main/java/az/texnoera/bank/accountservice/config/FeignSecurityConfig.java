package az.texnoera.bank.accountservice.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
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