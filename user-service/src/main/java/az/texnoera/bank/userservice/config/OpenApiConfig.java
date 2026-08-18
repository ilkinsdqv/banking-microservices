package az.texnoera.bank.userservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI bankingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Banking System API")
                        .description("Banking System API documentation for Banking System")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("TexnoEra")
                                .email("support@texnoera.az")));
    }
}
