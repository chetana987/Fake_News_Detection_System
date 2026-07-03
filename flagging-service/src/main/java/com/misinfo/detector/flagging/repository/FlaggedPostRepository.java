package com.misinfo.detector.flagging.repository;

import com.misinfo.detector.flagging.entity.FlaggedPostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlaggedPostRepository extends JpaRepository<FlaggedPostEntity, String> {

    List<FlaggedPostEntity> findAllByOrderByFlaggedAtDesc();
}
