package com.misinfo.detector.flagging.controller;

import com.misinfo.detector.flagging.entity.FlaggedPostEntity;
import com.misinfo.detector.flagging.repository.FlaggedPostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardWSController {

    private final FlaggedPostRepository flaggedPostRepo;

    public DashboardWSController(FlaggedPostRepository flaggedPostRepo) {
        this.flaggedPostRepo = flaggedPostRepo;
    }

    @GetMapping("/stats")
    public Object getStats() {
        List<FlaggedPostEntity> all = flaggedPostRepo.findAll();
        long total = all.size();
        long falseCount = all.stream().filter(p -> "FALSE".equals(p.getVerdict())).count();
        long suspiciousCount = all.stream().filter(p -> "SUSPICIOUS".equals(p.getVerdict())).count();
        long trueCount = all.stream().filter(p -> "TRUE".equals(p.getVerdict())).count();
        double avgTruthScore = total > 0 ? all.stream().mapToDouble(FlaggedPostEntity::getTruthScore).average().orElse(0) : 0;
        return Map.of("total", total, "falseCount", falseCount, "suspiciousCount", suspiciousCount,
                "trueCount", trueCount, "avgTruthScore", avgTruthScore);
    }

    @GetMapping("/flagged")
    public List<FlaggedPostEntity> getFlagged() {
        return flaggedPostRepo.findAllByOrderByFlaggedAtDesc();
    }

    @GetMapping("/flagged/{id}")
    public FlaggedPostEntity getFlaggedById(@PathVariable String id) {
        return flaggedPostRepo.findById(id).orElse(null);
    }
}
