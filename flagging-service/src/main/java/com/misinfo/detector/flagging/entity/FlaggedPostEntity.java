package com.misinfo.detector.flagging.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "flagged_posts")
public class FlaggedPostEntity {

    @Id
    private String id;

    @Column(nullable = false, length = 5000)
    private String text;

    private String author;

    private String platform;

    @Column(nullable = false)
    private double truthScore;

    @Column(nullable = false)
    private double confidence;

    @Column(nullable = false)
    private String verdict;

    @Column(nullable = false)
    private Instant flaggedAt;

    public FlaggedPostEntity() {}

    public FlaggedPostEntity(String id, String text, String author, String platform, double truthScore, double confidence, String verdict, Instant flaggedAt) {
        this.id = id;
        this.text = text;
        this.author = author;
        this.platform = platform;
        this.truthScore = truthScore;
        this.confidence = confidence;
        this.verdict = verdict;
        this.flaggedAt = flaggedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public double getTruthScore() { return truthScore; }
    public void setTruthScore(double truthScore) { this.truthScore = truthScore; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public Instant getFlaggedAt() { return flaggedAt; }
    public void setFlaggedAt(Instant flaggedAt) { this.flaggedAt = flaggedAt; }
}
