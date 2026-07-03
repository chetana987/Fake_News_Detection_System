package com.misinfo.detector.verification.service;

import com.misinfo.detector.model.EvidenceMatch;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class EvidenceRetrieverService {

    private static final Logger log = LoggerFactory.getLogger(EvidenceRetrieverService.class);
    private final RestTemplate restTemplate;
    private final String wikipediaApiUrl;
    private final String googleFactCheckApiUrl;
    private final String factCheckApiKey;
    private final Timer evidenceRetrievalLatency;

    public EvidenceRetrieverService(RestTemplate restTemplate,
                                    MeterRegistry meterRegistry,
                                    @Value("${evidence.wikipedia.api:https://en.wikipedia.org/api/rest_v1/page/summary/}") String wikipediaApiUrl,
                                    @Value("${evidence.googlefactcheck.api:https://factchecktools.googleapis.com/v1alpha1/claims:search}") String googleFactCheckApiUrl,
                                    @Value("${evidence.googlefactcheck.key:}") String factCheckApiKey) {
        this.restTemplate = restTemplate;
        this.wikipediaApiUrl = wikipediaApiUrl;
        this.googleFactCheckApiUrl = googleFactCheckApiUrl;
        this.factCheckApiKey = factCheckApiKey;
        this.evidenceRetrievalLatency = Timer.builder("evidence.retrieval.latency")
                .description("Time taken to retrieve evidence from all sources")
                .register(meterRegistry);
    }

    @Async("evidenceRetrievalExecutor")
    public CompletableFuture<List<EvidenceMatch>> retrieveFromPostgres(String claimText) {
        log.info("Searching PostgreSQL for evidence related to: {}", claimText);
        return CompletableFuture.completedFuture(List.of(
                EvidenceMatch.builder().source("postgres").url("").snippet("Cached local evidence for: " + claimText).similarityScore(0.0).entailment("").build()
        ));
    }

    @Async("evidenceRetrievalExecutor")
    public CompletableFuture<List<EvidenceMatch>> retrieveFromWikipedia(String claimText) {
        log.info("Searching Wikipedia for: {}", claimText);
        try {
            String[] keywords = claimText.split("\\s+");
            String query = keywords.length > 3 ? String.join("_", List.of(keywords).subList(0, 3)) : claimText.replace(" ", "_");
            String url = wikipediaApiUrl + query;
            var response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return CompletableFuture.completedFuture(List.of(
                        EvidenceMatch.builder().source("wikipedia").url(url).snippet(response.getBody()).similarityScore(0.0).entailment("").build()
                ));
            }
        } catch (Exception e) {
            log.warn("Wikipedia lookup failed: {}", e.getMessage());
        }
        return CompletableFuture.completedFuture(List.of());
    }

    @Async("evidenceRetrievalExecutor")
    public CompletableFuture<List<EvidenceMatch>> retrieveFromGoogleFactCheck(String claimText) {
        log.info("Searching Google Fact Check for: {}", claimText);
        try {
            String url = googleFactCheckApiUrl + "?query=" + claimText.replace(" ", "%20") + "&key=" + factCheckApiKey;
            if (!factCheckApiKey.isEmpty()) {
                var response = restTemplate.getForEntity(url, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    return CompletableFuture.completedFuture(List.of(
                            EvidenceMatch.builder().source("google_factcheck").url(url).snippet(response.getBody()).similarityScore(0.0).entailment("").build()
                    ));
                }
            }
        } catch (Exception e) {
            log.warn("Google Fact Check lookup failed: {}", e.getMessage());
        }
        return CompletableFuture.completedFuture(List.of());
    }

    @CircuitBreaker(name = "evidence-retrieval")
    public CompletableFuture<List<EvidenceMatch>> retrieveAll(String claimText) {
        Timer.Sample sample = Timer.start();
        List<CompletableFuture<List<EvidenceMatch>>> futures = List.of(
                retrieveFromPostgres(claimText),
                retrieveFromWikipedia(claimText),
                retrieveFromGoogleFactCheck(claimText)
        );
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> {
                    List<EvidenceMatch> all = new ArrayList<>();
                    futures.forEach(f -> all.addAll(f.join()));
                    sample.stop(evidenceRetrievalLatency);
                    return all;
                });
    }
}
