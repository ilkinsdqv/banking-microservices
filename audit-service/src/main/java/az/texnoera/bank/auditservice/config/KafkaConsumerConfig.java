package az.texnoera.bank.auditservice.config;

import az.texnoera.bank.common.audit.AuditEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, AuditEvent> auditEventConsumerFactory(
            KafkaProperties kafkaProperties
    ) {

        JsonDeserializer<AuditEvent> deserializer =
                new JsonDeserializer<>(AuditEvent.class);

        deserializer.addTrustedPackages(
                "az.texnoera.bank.common.audit"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                kafkaProperties.buildConsumerProperties(),
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AuditEvent>
    auditEventKafkaListenerContainerFactory(
            ConsumerFactory<String, AuditEvent> auditEventConsumerFactory
    ) {

        ConcurrentKafkaListenerContainerFactory<String, AuditEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(auditEventConsumerFactory);

        return factory;
    }
}