package com.misinfo.detector.ingestion.service;

import com.misinfo.detector.model.PostEvent;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class TwitterStreamService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Counter postsProcessed;
    private final Random random = new Random();

    private static final List<PostEvent> POSTS = List.of(
            PostEvent.builder().id("p-001").text("Breaking: Scientists confirm that drinking bleach cures all viruses.").author("health_warnings").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/health_warnings/status/1").build(),
            PostEvent.builder().id("p-002").text("NASA confirms Earth is flat based on new satellite imagery.").author("truth_seeker_22").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/truth_seeker_22/status/2").build(),
            PostEvent.builder().id("p-003").text("Vaccines cause autism according to leaked government report.").author("free_info_net").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/free_info_net/status/3").build(),
            PostEvent.builder().id("p-004").text("The WHO has declared that 5G towers spread coronavirus.").author("conspiracy_daily").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/conspiracy_daily/status/4").build(),
            PostEvent.builder().id("p-005").text("A prominent politician admitted to being a reptilian alien in a secret recording.").author("exposed_truth").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/exposed_truth/status/5").build(),
            PostEvent.builder().id("p-006").text("Scientists at CERN announce breakthrough in nuclear fusion energy.").author("science_daily").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/science_daily/status/6").build(),
            PostEvent.builder().id("p-007").text("Fed raises interest rates by 25 basis points to curb inflation.").author("financial_times").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/financial_times/status/7").build(),
            PostEvent.builder().id("p-008").text("New study shows regular exercise reduces risk of heart disease by 40%.").author("health_news").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/health_news/status/8").build(),
            PostEvent.builder().id("p-009").text("Elon Musk announces Tesla has achieved full self-driving capability.").author("tech_chronicle").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/tech_chronicle/status/9").build(),
            PostEvent.builder().id("p-010").text("Bill Gates plans to inject microchips into everyone through COVID vaccines.").author("awakening_now").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/awakening_now/status/10").build(),
            PostEvent.builder().id("p-011").text("Japan successfully lands rover on Mars, marking first Asian nation to do so.").author("space_today").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/space_today/status/11").build(),
            PostEvent.builder().id("p-012").text("The moon landing was actually filmed in a Hollywood studio in 1969.").author("truth_seeker_22").timestamp(Instant.now()).platform("twitter").url("https://twitter.com/truth_seeker_22/status/12").build()
    );

    public TwitterStreamService(KafkaTemplate<String, Object> kafkaTemplate, MeterRegistry meterRegistry) {
        this.kafkaTemplate = kafkaTemplate;
        this.postsProcessed = Counter.builder("posts.processed")
                .description("Total posts streamed into the pipeline")
                .register(meterRegistry);
    }

    @Scheduled(fixedRate = 5000)
    public void streamPost() {
        PostEvent post = POSTS.get(random.nextInt(POSTS.size()));
        post.setId(UUID.randomUUID().toString());
        post.setTimestamp(Instant.now());
        kafkaTemplate.send("raw-posts", post.getId(), post);
        postsProcessed.increment();
    }
}
