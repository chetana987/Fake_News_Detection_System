package com.misinfo.detector.flagging.integration;

import com.misinfo.detector.flagging.entity.FlaggedPostEntity;
import com.misinfo.detector.flagging.entity.VerificationResultEntity;
import com.misinfo.detector.flagging.repository.FlaggedPostRepository;
import com.misinfo.detector.flagging.repository.VerificationResultRepository;
import com.misinfo.detector.flagging.service.FlaggingService;
import com.misinfo.detector.model.VerificationResult;
import com.misinfo.detector.model.Verdict;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@EmbeddedKafka(topics = {"scored-claims", "flagged-posts"}, partitions = 1,
        bootstrapServersProperty = "spring.kafka.bootstrap-servers")
@ActiveProfiles("integration")
class FlaggingIntegrationTest {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private VerificationResultRepository verificationResultRepo;

    @Autowired
    private FlaggedPostRepository flaggedPostRepo;

    @Test
    void shouldFlagFalseClaimAndPersist() {
        VerificationResult result = VerificationResult.builder()
                .claimId("test-claim-001")
                .truthScore(0.15)
                .confidence(0.95)
                .verdict(Verdict.FALSE)
                .evidenceMatches(List.of())
                .verifiedAt(Instant.now())
                .build();

        kafkaTemplate.send("scored-claims", result.getClaimId(), result);

        Awaitility.await()
                .atMost(10, TimeUnit.SECONDS)
                .untilAsserted(() -> {
                    assertThat(verificationResultRepo.findById("test-claim-001")).isPresent();
                    assertThat(flaggedPostRepo.findById("test-claim-001")).isPresent();
                });

        VerificationResultEntity saved = verificationResultRepo.findById("test-claim-001").orElseThrow();
        assertThat(saved.getVerdict()).isEqualTo("FALSE");
        assertThat(saved.getTruthScore()).isEqualTo(0.15);
    }

    @Test
    void shouldApplyRuleFalseWhenScoreBelowThreshold() {
        assertThat(FlaggingService.applyRules(0.2, 0.9)).isEqualTo("FALSE");
        assertThat(FlaggingService.applyRules(0.4, 0.9)).isEqualTo("SUSPICIOUS");
        assertThat(FlaggingService.applyRules(0.6, 0.9)).isEqualTo("TRUE");
        assertThat(FlaggingService.applyRules(0.6, 0.5)).isEqualTo("UNVERIFIABLE");
    }
}
