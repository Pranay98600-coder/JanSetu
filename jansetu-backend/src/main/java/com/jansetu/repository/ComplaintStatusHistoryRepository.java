package com.jansetu.repository;

import com.jansetu.entity.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintStatusHistoryRepository
        extends JpaRepository<ComplaintStatusHistory, Long> {

    List<ComplaintStatusHistory>
    findByComplaintIdOrderByChangedAtAsc(Long complaintId);
}