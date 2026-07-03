package com.misinfo.detector.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostEvent {
    private String id;
    private String text;
    private String author;
    private Instant timestamp;
    private String platform;
    private String url;
}
