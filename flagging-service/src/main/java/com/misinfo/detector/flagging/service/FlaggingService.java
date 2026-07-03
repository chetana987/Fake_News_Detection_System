package com.misinfo.detector.flagging.service;

import com.misinfo.detector.flagging.entity.FlaggedPostEntity;
import com.misinfo.detector.flagging.entity.VerificationResultEntity;
import com.misinfo.detector.flagging.repository.FlaggedPostRepository;
import com.misinfo.detector.flagging.repository.VerificationResultRepository;
import com.misinfo.detector.model.VerificationResult;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class FlaggingService {

    private static final Logger log = LoggerFactory.getLogger(FlaggingService.class);
    private final VerificationResultRepository verificationResultRepo;
    private final FlaggedPostRepository flaggedPostRepo;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Counter flaggedTotal;

    public FlaggingService(VerificationResultRepository verificationResultRepo,
                           FlaggedPostRepository flaggedPostRepo,
                           KafkaTemplate<String, Object> kafkaTemplate,
                           MeterRegistry meterRegistry) {
        this.verificationResultRepo = verificationResultRepo;
        this.flaggedPostRepo = flaggedPostRepo;
        this.kafkaTemplate = kafkaTemplate;
        this.flaggedTotal = Counter.builder("flagged.total")
                .description("Total claims flagged after verification")
                .register(meterRegistry);
    }

    @RetryableTopic(
        attempts = "4",
        backoff = @Backoff(delay = 1000, multiplier = 2.0),
        autoCreateTopics = "false",
        topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE
    )
    @KafkaListener(topics = "scored-claims", groupId = "flagging-service")
    @Transactional
    public void flagClaim(VerificationResult result) {
        String verdict = applyRules(result.getTruthScore(), result.getConfidence());
        result.setVerdict(com.misinfo.detector.model.Verdict.valueOf(verdict));

        VerificationResultEntity vre = new VerificationResultEntity(
                result.getClaimId(), result.getTruthScore(), result.getConfidence(),
                verdict, result.getVerifiedAt() != null ? result.getVerifiedAt() : Instant.now());
        verificationResultRepo.save(vre);

        FlaggedPostEntity fpe = new FlaggedPostEntity(
                result.getClaimId(), "", "", "",
                result.getTruthScore(), result.getConfidence(),
                verdict, Instant.now());
        flaggedPostRepo.save(fpe);

        kafkaTemplate.send("flagged-posts", fpe.getId(), fpe);
        flaggedTotal.increment();
        log.info("Flagged claim {} as {}", result.getClaimId(), verdict);
    }

    public static String applyRules(double truthScore, double confidence) {
        if (truthScore < 0.3) return "FALSE";
        if (truthScore < 0.5) return "SUSPICIOUS";
        if (confidence > 0.8) return "TRUE";
        return "UNVERIFIABLE";
    }
}
