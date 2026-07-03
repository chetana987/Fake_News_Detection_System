package com.misinfo.detector.flagging.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "verification_results")
public class VerificationResultEntity {

    @Id
    private String claimId;

    @Column(nullable = false)
    private double truthScore;

    @Column(nullable = false)
    private double confidence;

    @Column(nullable = false)
    private String verdict;

    @Column(nullable = false)
    private Instant verifiedAt;

    public VerificationResultEntity() {}

    public VerificationResultEntity(String claimId, double truthScore, double confidence, String verdict, Instant verifiedAt) {
        this.claimId = claimId;
        this.truthScore = truthScore;
        this.confidence = confidence;
        this.verdict = verdict;
        this.verifiedAt = verifiedAt;
    }

    public String getClaimId() { return claimId; }
    public void setClaimId(String claimId) { this.claimId = claimId; }
    public double getTruthScore() { return truthScore; }
    public void setTruthScore(double truthScore) { this.truthScore = truthScore; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
}
