package az.texnoera.bank.complaintservice.config;

import az.texnoera.bank.complaintservice.complaint.entity.Complaint;
import az.texnoera.bank.complaintservice.complaint.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("complaintSecurityService")
@RequiredArgsConstructor
public class ComplaintSecurityService {

    private final ComplaintRepository complaintRepository;

    public boolean isOwner(
            Authentication authentication,
            UUID complaintId
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID currentUserId)) {
            return false;
        }

        return complaintRepository.findById(complaintId)
                .map(Complaint::getUserId)
                .map(currentUserId::equals)
                .orElse(false);
    }
}