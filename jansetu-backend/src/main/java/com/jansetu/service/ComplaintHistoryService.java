package com.jansetu.service;

import com.jansetu.entity.Complaint;
import com.jansetu.entity.ComplaintStatusHistory;
import com.jansetu.entity.User;
import com.jansetu.enums.ComplaintStatus;
import com.jansetu.repository.ComplaintStatusHistoryRepository;

import org.springframework.stereotype.Service;

@Service
public class ComplaintHistoryService {

    private final ComplaintStatusHistoryRepository historyRepository;

    public ComplaintHistoryService(
            ComplaintStatusHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public void recordStatusChange(
            Complaint complaint,
            ComplaintStatus previousStatus,
            ComplaintStatus newStatus,
            User changedBy,
            String remarks) {

        ComplaintStatusHistory history = new ComplaintStatusHistory();

        history.setComplaint(complaint);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setRemarks(remarks);

        historyRepository.save(history);
    }
}