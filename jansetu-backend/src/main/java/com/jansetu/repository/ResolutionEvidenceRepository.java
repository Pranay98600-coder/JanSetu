package com.jansetu.repository;

import com.jansetu.entity.ResolutionEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResolutionEvidenceRepository
        extends JpaRepository<ResolutionEvidence, Long> {

    List<ResolutionEvidence> findByComplaintIdOrderByUploadedAtDesc(
            Long complaintId
    );
}