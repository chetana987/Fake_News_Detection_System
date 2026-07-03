package com.misinfo.detector.flagging.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
@EnableKafka
@EnableRetry
public class KafkaConfig {

    @Bean
    public NewTopic flaggedPosts() {
        return TopicBuilder.name("flagged-posts").partitions(3).replicas(1).build();
    }

    @Bean
    public DeadLetterPublishingRecoverer deadLetterPublishingRecoverer(KafkaTemplate<String, Object> kafkaTemplate) {
        return new DeadLetterPublishingRecoverer(kafkaTemplate);
    }

    @Bean
    public DefaultErrorHandler defaultErrorHandler(DeadLetterPublishingRecoverer deadLetterPublishingRecoverer) {
        return new DefaultErrorHandler(deadLetterPublishingRecoverer, new FixedBackOff(1000L, 2L));
    }

    @Bean
    public NewTopic scoredClaimsDlt() {
        return TopicBuilder.name("scored-claims.DLT").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic flaggedPostsDlt() {
        return TopicBuilder.name("flagged-posts.DLT").partitions(3).replicas(1).build();
    }
}
