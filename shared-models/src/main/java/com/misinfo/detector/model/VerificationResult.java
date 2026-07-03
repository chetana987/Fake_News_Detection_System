package com.misinfo.detector.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationResult {
    private String claimId;
    private double truthScore;
    private double confidence;
    private Verdict verdict;
    private List<EvidenceMatch> evidenceMatches;
    private Instant verifiedAt;
}
