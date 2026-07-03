package com.misinfo.detector.verification.health;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class MlServiceHealthIndicator implements HealthIndicator {

    private final RestTemplate restTemplate;
    private final String mlServiceUrl;

    public MlServiceHealthIndicator(RestTemplate restTemplate,
                                    @Value("${ml.service.url:http://localhost:8000}") String mlServiceUrl) {
        this.restTemplate = restTemplate;
        this.mlServiceUrl = mlServiceUrl;
    }

    @Override
    public Health health() {
        try {
            var response = restTemplate.getForEntity(mlServiceUrl + "/health", String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return Health.up().withDetail("url", mlServiceUrl).build();
            }
            return Health.down().withDetail("url", mlServiceUrl)
                    .withDetail("status", response.getStatusCodeValue()).build();
        } catch (Exception e) {
            return Health.down(e).withDetail("url", mlServiceUrl).build();
        }
    }
}
