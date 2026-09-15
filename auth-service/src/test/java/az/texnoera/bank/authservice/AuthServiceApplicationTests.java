package az.texnoera.bank.authservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.assertj.core.api.Assertions.assertThat;

class AuthServiceApplicationTests {

    @Test
    void shouldDeclareSpringBootApplication() {
        assertThat(AuthServiceApplication.class)
                .hasAnnotation(SpringBootApplication.class);
    }

}
