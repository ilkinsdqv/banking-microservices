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
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, AuditEvent> auditEventConsumerFactory(
            KafkaProperties kafkaProperties
    ) {

        JsonDeserializer<AuditEvent> jsonDeserializer =
                new JsonDeserializer<>(AuditEvent.class);

        jsonDeserializer.addTrustedPackages(
                "az.texnoera.bank.common.audit"
        );

        jsonDeserializer.setUseTypeHeaders(false);

        ErrorHandlingDeserializer<AuditEvent> valueDeserializer =
                new ErrorHandlingDeserializer<>(
                        jsonDeserializer
                );

        return new DefaultKafkaConsumerFactory<>(
                kafkaProperties.buildConsumerProperties(),
                new StringDeserializer(),
                valueDeserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AuditEvent>
    auditEventKafkaListenerContainerFactory(
            ConsumerFactory<String, AuditEvent> auditEventConsumerFactory
    ) {

        ConcurrentKafkaListenerContainerFactory<String, AuditEvent>
                factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                auditEventConsumerFactory
        );

        DefaultErrorHandler errorHandler =
                new DefaultErrorHandler(
                        new FixedBackOff(0L, 0L)
                );

        factory.setCommonErrorHandler(errorHandler);

        return factory;
    }
}