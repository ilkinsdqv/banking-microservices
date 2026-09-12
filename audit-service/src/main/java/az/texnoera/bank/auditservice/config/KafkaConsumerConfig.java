package az.texnoera.bank.auditservice.config;

import az.texnoera.bank.common.audit.AuditEvent;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, AuditEvent> auditEventConsumerFactory() {

        JsonDeserializer<AuditEvent> deserializer =
                new JsonDeserializer<>(AuditEvent.class);

        deserializer.addTrustedPackages(
                "az.texnoera.bank.common.audit"
        );

        Map<String, Object> properties = new HashMap<>();

        properties.put(
                org.apache.kafka.clients.consumer.ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        properties.put(
                org.apache.kafka.clients.consumer.ConsumerConfig.GROUP_ID_CONFIG,
                "audit-service"
        );

        properties.put(
                org.apache.kafka.clients.consumer.ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );

        properties.put(
                org.apache.kafka.clients.consumer.ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                JsonDeserializer.class
        );

        properties.put(
                JsonDeserializer.TRUSTED_PACKAGES,
                "az.texnoera.bank.common.audit"
        );

        properties.put(
                JsonDeserializer.USE_TYPE_INFO_HEADERS,
                false
        );

        properties.put(
                org.apache.kafka.clients.consumer.ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,
                "earliest"
        );

        properties.put(
                org.apache.kafka.clients.consumer.ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,
                false
        );

        return new DefaultKafkaConsumerFactory<>(
                properties,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AuditEvent>
    auditEventKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, AuditEvent>
                factory = new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(auditEventConsumerFactory());

        return factory;
    }
}