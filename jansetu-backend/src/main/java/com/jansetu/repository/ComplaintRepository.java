
package com.jansetu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jansetu.entity.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Find complaint using its public tracking number
    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    // Check whether a complaint number already exists
    boolean existsByComplaintNumber(String complaintNumber);

    // Find all complaints submitted by a particular citizen
    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    // Find complaint belonging to a particular citizen
    Optional<Complaint> findByIdAndCitizenId(Long id, Long citizenId);

}
