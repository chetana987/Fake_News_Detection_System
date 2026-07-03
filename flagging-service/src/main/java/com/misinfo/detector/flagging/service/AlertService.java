package com.misinfo.detector.flagging.service;

import com.misinfo.detector.flagging.entity.FlaggedPostEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);
    private final SimpMessagingTemplate messagingTemplate;

    public AlertService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "flagged-posts", groupId = "alert-group")
    public void sendAlert(FlaggedPostEntity post) {
        messagingTemplate.convertAndSend("/topic/flagged-claims", post);
        log.info("WebSocket alert sent for flagged post {}", post.getId());

        if ("FALSE".equals(post.getVerdict())) {
            sendEmailAlert(post);
        }
    }

    private void sendEmailAlert(FlaggedPostEntity post) {
        log.info("Email alert would be sent for FALSE claim: {} (score={})",
                post.getId(), post.getTruthScore());
    }
}
