package az.texnoera.bank.complaintservice.config;

import az.texnoera.bank.common.audit.AuditEvent;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, AuditEvent> auditEventProducerFactory(
            KafkaProperties kafkaProperties
    ) {
        return new DefaultKafkaProducerFactory<>(
                kafkaProperties.buildProducerProperties(),
                new StringSerializer(),
                new JsonSerializer<>()
        );
    }

    @Bean
    public KafkaTemplate<String, AuditEvent> auditEventKafkaTemplate(
            ProducerFactory<String, AuditEvent> auditEventProducerFactory
    ) {
        return new KafkaTemplate<>(auditEventProducerFactory);
    }
}