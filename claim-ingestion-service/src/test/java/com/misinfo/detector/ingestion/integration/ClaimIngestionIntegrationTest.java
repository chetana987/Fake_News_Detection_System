package com.misinfo.detector.ingestion.integration;

import com.misinfo.detector.model.ClaimEvent;
import com.misinfo.detector.model.PostEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.KafkaTestUtils;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@EmbeddedKafka(topics = {"raw-posts", "claims-extracted"}, partitions = 3,
        bootstrapServersProperty = "spring.kafka.bootstrap-servers")
@ActiveProfiles("integration")
class ClaimIngestionIntegrationTest {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @SpyBean
    private com.misinfo.detector.ingestion.consumer.PostConsumer postConsumer;

    private org.apache.kafka.clients.consumer.Consumer<String, ClaimEvent> testConsumer;

    @BeforeEach
    void setUp(@Autowired EmbeddedKafkaBroker embeddedKafka) {
        Map<String, Object> config = KafkaTestUtils.consumerProps("test-group", "false", embeddedKafka);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        config.put(JsonDeserializer.VALUE_DEFAULT_TYPE, ClaimEvent.class.getName());
        testConsumer = new DefaultKafkaConsumerFactory<String, ClaimEvent>(config).createConsumer();
        embeddedKafka.consumeFromAnEmbeddedTopic(testConsumer, "claims-extracted");
    }

    @Test
    void shouldProcessPostAndPublishClaim() {
        PostEvent post = PostEvent.builder()
                .id(UUID.randomUUID().toString())
                .text("Scientists confirm vaccines reduce risk of severe illness by 95%")
                .author("WHO")
                .platform("twitter")
                .timestamp(Instant.now())
                .build();

        kafkaTemplate.send("raw-posts", post.getId(), post);

        Awaitility.await()
                .atMost(15, TimeUnit.SECONDS)
                .untilAsserted(() -> {
                    var records = testConsumer.poll(Duration.ofMillis(200));
                    boolean found = false;
                    for (var r : records.records("claims-extracted")) {
                        if (r.value() != null && post.getId().equals(r.value().getPostId())) {
                            found = true;
                            break;
                        }
                    }
                    assertThat(found).isTrue();
                });
    }
}
