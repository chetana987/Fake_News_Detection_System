package com.misinfo.detector.ingestion.consumer;

import com.misinfo.detector.ingestion.service.ClaimExtractionClient;
import com.misinfo.detector.model.PostEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

@Component
public class PostConsumer {

    private static final Logger log = LoggerFactory.getLogger(PostConsumer.class);
    private final ClaimExtractionClient claimExtractionClient;

    public PostConsumer(ClaimExtractionClient claimExtractionClient) {
        this.claimExtractionClient = claimExtractionClient;
    }

    @RetryableTopic(
        attempts = "4",
        backoff = @Backoff(delay = 1000, multiplier = 2.0),
        autoCreateTopics = "false",
        topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE
    )
    @KafkaListener(topics = "raw-posts", groupId = "post-consumer")
    public void consume(PostEvent post) {
        log.info("Received post {} from {}: {}", post.getId(), post.getAuthor(), post.getText());
        claimExtractionClient.extractClaims(post);
    }
}
