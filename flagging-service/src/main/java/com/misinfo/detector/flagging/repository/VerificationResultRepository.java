package com.misinfo.detector.flagging.repository;

import com.misinfo.detector.flagging.entity.VerificationResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationResultRepository extends JpaRepository<VerificationResultEntity, String> {
}
