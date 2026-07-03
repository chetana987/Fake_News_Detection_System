package com.misinfo.detector.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimEvent {
    private String postId;
    private String claimText;
    private String subject;
    private String relation;
    private String object;
    private float[] embedding;
    private double confidence;
}
