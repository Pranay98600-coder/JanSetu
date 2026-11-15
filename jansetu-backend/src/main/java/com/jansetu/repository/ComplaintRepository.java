
package com.jansetu.repository;

import java.util.List;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.jansetu.entity.Complaint;
import com.jansetu.enums.ComplaintPriority;
import com.jansetu.enums.ComplaintStatus;
import org.springframework.data.repository.query.Param;

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
    
    long countByStatus(ComplaintStatus status);

    long countByPriority(ComplaintPriority priority);
    
    @Query("""
    	    SELECT c.status, COUNT(c)
    	    FROM Complaint c
    	    GROUP BY c.status
    	    ORDER BY c.status
    	""")
    	List<Object[]> countComplaintsByStatus();
    	
    	@Query("""
    		    SELECT c.category, COUNT(c)
    		    FROM Complaint c
    		    GROUP BY c.category
    		    ORDER BY c.category
    		""")
    		List<Object[]> countComplaintsByCategory();
    		

@Query("""
    SELECT FUNCTION('DATE_FORMAT', c.createdAt, '%Y-%m') AS month,
           COUNT(c) AS total
    FROM Complaint c
    GROUP BY FUNCTION('DATE_FORMAT', c.createdAt, '%Y-%m')
    ORDER BY month
""")
List<Object[]> countMonthlyComplaints();



@Query("""
    SELECT c.assignedOfficer.id,
           c.assignedOfficer.fullName,
           COUNT(c),
           SUM(CASE WHEN c.status = :resolved THEN 1 ELSE 0 END),
           SUM(CASE WHEN c.status = :inProgress THEN 1 ELSE 0 END)
    FROM Complaint c
    WHERE c.assignedOfficer IS NOT NULL
    GROUP BY c.assignedOfficer.id, c.assignedOfficer.fullName
    ORDER BY c.assignedOfficer.fullName
""")
List<Object[]> getOfficerPerformance(
    @Param("resolved") ComplaintStatus resolved,
    @Param("inProgress") ComplaintStatus inProgress
);

}
