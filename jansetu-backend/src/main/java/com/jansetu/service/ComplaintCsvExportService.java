
package com.jansetu.service;

import com.jansetu.entity.Complaint;
import com.jansetu.repository.ComplaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ComplaintCsvExportService {

    private final ComplaintRepository complaintRepository;

    public ComplaintCsvExportService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @Transactional(readOnly = true)
    public byte[] exportComplaints() {

        List<Complaint> complaints = complaintRepository.findAll();

        StringBuilder csv = new StringBuilder();

        csv.append("Complaint Number,Title,Category,Description,")
           .append("Status,Priority,Citizen Name,Citizen Email,")
           .append("Assigned Officer,Address,Latitude,Longitude,Created At\n");

        for (Complaint complaint : complaints) {

            csv.append(escape(complaint.getComplaintNumber())).append(",");
            csv.append(escape(complaint.getTitle())).append(",");
            csv.append(escape(complaint.getCategory())).append(",");
            csv.append(escape(complaint.getDescription())).append(",");
            csv.append(escape(complaint.getStatus().name())).append(",");
            csv.append(escape(complaint.getPriority().name())).append(",");
            csv.append(escape(complaint.getCitizen().getFullName())).append(",");
            csv.append(escape(complaint.getCitizen().getEmail())).append(",");

            String officerName = complaint.getAssignedOfficer() != null
                    ? complaint.getAssignedOfficer().getFullName()
                    : "";

            csv.append(escape(officerName)).append(",");
            csv.append(escape(complaint.getAddress())).append(",");
            csv.append(complaint.getLatitude() != null
                    ? complaint.getLatitude() : "").append(",");
            csv.append(complaint.getLongitude() != null
                    ? complaint.getLongitude() : "").append(",");
            csv.append(escape(String.valueOf(complaint.getCreatedAt())));
            csv.append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escape(String value) {

        if (value == null) {
            return "";
        }

        String escaped = value.replace("\"", "\"\"");

        return "\"" + escaped + "\"";
    }
}
