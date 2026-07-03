package com.misinfo.detector.verification.service;

import com.misinfo.detector.model.EvidenceMatch;
import com.misinfo.detector.model.Verdict;
import com.misinfo.detector.model.VerificationResult;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import misinfo.Misinfo;
import misinfo.VerifierGrpc;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PreDestroy;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class PythonGrpcClient {

    private static final Logger log = LoggerFactory.getLogger(PythonGrpcClient.class);
    private final ManagedChannel channel;
    private final VerifierGrpc.VerifierBlockingStub stub;

    public PythonGrpcClient(@Value("${python.verifier.grpc.host:localhost}") String host,
                            @Value("${python.verifier.grpc.port:50052}") int port) {
        this.channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();
        this.stub = VerifierGrpc.newBlockingStub(channel);
    }

    @CircuitBreaker(name = "grpc-verifier", fallbackMethod = "verifyFallback")
    @Retry(name = "grpc-verifier")
    public VerificationResult verify(String claimText, List<String> evidenceTexts) {
        Misinfo.VerifyClaimRequest request = Misinfo.VerifyClaimRequest.newBuilder()
                .setClaimText(claimText)
                .addAllEvidenceTexts(evidenceTexts)
                .build();

        Misinfo.VerificationResult response = stub.verifyClaim(request);

        List<EvidenceMatch> matches = response.getEvidenceMatchesList().stream()
                .map(em -> EvidenceMatch.builder()
                        .source(em.getSource())
                        .url(em.getUrl())
                        .snippet(em.getSnippet())
                        .similarityScore(em.getSimilarityScore())
                        .entailment(em.getEntailment())
                        .build())
                .collect(Collectors.toList());

        return VerificationResult.builder()
                .claimId(response.getClaimId())
                .truthScore(response.getTruthScore())
                .confidence(response.getConfidence())
                .verdict(Verdict.valueOf(response.getVerdict()))
                .evidenceMatches(matches)
                .verifiedAt(Instant.parse(response.getVerifiedAt()))
                .build();
    }

    public VerificationResult verifyFallback(String claimText, List<String> evidenceTexts, Throwable t) {
        log.warn("gRPC verifier call failed, returning stub result: {}", t.getMessage());
        return VerificationResult.builder()
                .claimId("stub")
                .truthScore(0.5)
                .confidence(0.0)
                .verdict(Verdict.UNVERIFIABLE)
                .evidenceMatches(List.of())
                .verifiedAt(Instant.now())
                .build();
    }

    @PreDestroy
    public void shutdown() {
        channel.shutdown();
        try {
            channel.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
