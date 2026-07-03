package com.misinfo.detector.flagging;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class FlaggingApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlaggingApplication.class, args);
    }
}
