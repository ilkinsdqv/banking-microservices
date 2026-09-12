package az.texnoera.bank.complaintservice.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignSecurityConfig {

    @Bean
    public RequestInterceptor internalServiceInterceptor(
            @Value("${security.internal-service-key}")
            String internalServiceKey
    ) {
        return requestTemplate ->
                requestTemplate.header(
                        "X-Internal-Service-Key",
                        internalServiceKey
                );
    }
}