package az.texnoera.bank.notificationservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.mail.host=localhost",
        "spring.mail.port=1025",
        "spring.mail.properties.mail.smtp.auth=false",
        "spring.mail.properties.mail.smtp.starttls.enable=false"
})
class NotificationServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}