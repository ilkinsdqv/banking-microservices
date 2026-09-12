package az.texnoera.bank.complaintservice.complaint.controller;

import az.texnoera.bank.complaintservice.complaint.dto.request.CreateComplaintRequest;
import az.texnoera.bank.complaintservice.complaint.dto.request.ResolveComplaintRequest;
import az.texnoera.bank.complaintservice.complaint.dto.response.ComplaintResponse;
import az.texnoera.bank.complaintservice.complaint.entity.ComplaintStatus;
import az.texnoera.bank.complaintservice.complaint.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            Authentication authentication,
            @Valid @RequestBody CreateComplaintRequest request
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        complaintService.createComplaint(
                                userId,
                                request
                        )
                );
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        return ResponseEntity.ok(
                complaintService.getMyComplaints(userId)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@complaintSecurityService.isOwner(authentication, #id)"
    )
    public ResponseEntity<ComplaintResponse> getComplaintById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                complaintService.getComplaintById(id)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByStatus(
            @PathVariable ComplaintStatus status
    ) {
        return ResponseEntity.ok(
                complaintService.getComplaintsByStatus(status)
        );
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> startProcessing(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                complaintService.startProcessing(id)
        );
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> resolveComplaint(
            @PathVariable UUID id,
            @Valid @RequestBody ResolveComplaintRequest request
    ) {
        return ResponseEntity.ok(
                complaintService.resolveComplaint(id, request)
        );
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> closeComplaint(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                complaintService.closeComplaint(id)
        );
    }
}