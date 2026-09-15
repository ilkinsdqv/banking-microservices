package az.texnoera.bank.complaintservice.complaint.repository;

import az.texnoera.bank.complaintservice.complaint.entity.Complaint;
import az.texnoera.bank.complaintservice.complaint.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {

    List<Complaint> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Complaint> findAllByStatusOrderByCreatedAtDesc(
            ComplaintStatus status
    );

    List<Complaint> findAllByOrderByCreatedAtDesc();
}