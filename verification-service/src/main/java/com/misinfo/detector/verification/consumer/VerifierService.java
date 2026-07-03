package com.misinfo.detector.verification.consumer;

import com.misinfo.detector.model.ClaimEvent;
import com.misinfo.detector.model.EvidenceMatch;
import com.misinfo.detector.model.VerificationResult;
import com.misinfo.detector.verification.service.EvidenceRetrieverService;
import com.misinfo.detector.verification.service.PythonGrpcClient;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class VerifierService {

    private static final Logger log = LoggerFactory.getLogger(VerifierService.class);
    private final EvidenceRetrieverService evidenceRetriever;
    private final PythonGrpcClient pythonGrpcClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Timer verificationLatency;

    public VerifierService(EvidenceRetrieverService evidenceRetriever,
                           PythonGrpcClient pythonGrpcClient,
                           KafkaTemplate<String, Object> kafkaTemplate,
                           MeterRegistry meterRegistry) {
        this.evidenceRetriever = evidenceRetriever;
        this.pythonGrpcClient = pythonGrpcClient;
        this.kafkaTemplate = kafkaTemplate;
        this.verificationLatency = Timer.builder("verification.latency")
                .description("Time taken to verify a claim end-to-end")
                .register(meterRegistry);
    }

    @RetryableTopic(
        attempts = "4",
        backoff = @Backoff(delay = 1000, multiplier = 2.0),
        autoCreateTopics = "false",
        topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE
    )
    @KafkaListener(topics = "claims-extracted", groupId = "verifier-service")
    public void verifyClaim(ClaimEvent claim) {
        Timer.Sample sample = Timer.start();
        log.info("Verifying claim {}: {}", claim.getPostId(), claim.getClaimText());

        List<EvidenceMatch> evidence = evidenceRetriever.retrieveAll(claim.getClaimText()).join();

        List<String> evidenceTexts = evidence.stream()
                .map(EvidenceMatch::getSnippet)
                .collect(Collectors.toList());

        VerificationResult result = pythonGrpcClient.verify(claim.getClaimText(), evidenceTexts);
        result.setClaimId(claim.getPostId());

        kafkaTemplate.send("scored-claims", result.getClaimId(), result);
        sample.stop(verificationLatency);
        log.info("Published verification result for claim {} to scored-claims, truthScore={}",
                result.getClaimId(), result.getTruthScore());
    }
}
