package com.misinfo.detector.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenceMatch {
    private String source;
    private String url;
    private String snippet;
    private double similarityScore;
    private String entailment;
}
