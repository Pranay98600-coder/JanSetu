
package com.jansetu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.jansetu.entity.Complaint;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.enums.ComplaintStatus;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    boolean existsByComplaintNumber(String complaintNumber);

    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    Optional<Complaint> findByIdAndCitizenId(Long id, Long citizenId);

    // Admin: Get all complaints
    Page<Complaint> findAllBy(Pageable pageable);

    // Admin: Filter by status
    Page<Complaint> findByStatus(
            ComplaintStatus status, Pageable pageable);

    // Admin: Filter by priority
    Page<Complaint> findByPriority(
            ComplaintPriority priority, Pageable pageable);

    // Admin: Filter by both status and priority
    Page<Complaint> findByStatusAndPriority(
            ComplaintStatus status,
            ComplaintPriority priority,
            Pageable pageable);
    
    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(Long officerId);

    Optional<Complaint> findByIdAndAssignedOfficerId(
            Long id,
            Long officerId
    );
}
