package com.misinfo.detector.ingestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableKafka
@EnableScheduling
public class ClaimIngestionApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClaimIngestionApplication.class, args);
    }
}
