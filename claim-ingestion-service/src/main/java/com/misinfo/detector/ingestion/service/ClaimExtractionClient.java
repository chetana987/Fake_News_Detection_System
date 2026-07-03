package com.misinfo.detector.ingestion.service;

import com.misinfo.detector.model.ClaimEvent;
import com.misinfo.detector.model.PostEvent;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ClaimExtractionClient {

    private static final Logger log = LoggerFactory.getLogger(ClaimExtractionClient.class);
    private final RestTemplate restTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String mlServiceUrl;
    private final Counter claimsExtracted;

    public ClaimExtractionClient(RestTemplate restTemplate,
                                 KafkaTemplate<String, Object> kafkaTemplate,
                                 MeterRegistry meterRegistry,
                                 @Value("${ml.service.url:http://localhost:8000}") String mlServiceUrl) {
        this.restTemplate = restTemplate;
        this.kafkaTemplate = kafkaTemplate;
        this.mlServiceUrl = mlServiceUrl;
        this.claimsExtracted = Counter.builder("claims.extracted")
                .description("Total claims extracted from posts")
                .register(meterRegistry);
    }

    @CircuitBreaker(name = "ml-service", fallbackMethod = "extractFallback")
    public void extractClaims(PostEvent post) {
        Map<String, String> request = Map.of("text", post.getText());
        ClaimEvent claim = restTemplate.postForObject(
                mlServiceUrl + "/extract-claim", request, ClaimEvent.class);

        if (claim != null) {
            claim.setPostId(post.getId());
            kafkaTemplate.send("claims-extracted", claim.getPostId(), claim);
            claimsExtracted.increment();
            log.info("Published claim for post {} to claims-extracted", post.getId());
        }
    }

    public void extractFallback(PostEvent post, Throwable t) {
        log.warn("ML service unavailable, publishing fallback claim for post {}", post.getId());
        ClaimEvent fallback = ClaimEvent.builder()
                .postId(post.getId())
                .claimText(post.getText())
                .embedding(new float[0])
                .confidence(0.0)
                .build();
        kafkaTemplate.send("claims-extracted", fallback.getPostId(), fallback);
        claimsExtracted.increment();
    }
}
