package az.texnoera.bank.auditservice.audit.controller;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.auditservice.audit.service.AuditLogService;
import az.texnoera.bank.common.audit.AuditAction;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audits")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @PostMapping
    @PreAuthorize("hasRole('INTERNAL_SERVICE')")
    public ResponseEntity<AuditLogResponse> createAuditLog(
            @Valid @RequestBody CreateAuditLogRequest request
    ) {
        return ResponseEntity.ok(
                auditLogService.createAuditLog(request)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditLogResponse> getAuditLogById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogById(id)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLogResponse>> getAllAuditLogs() {
        return ResponseEntity.ok(
                auditLogService.getAllAuditLogs()
        );
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByUserId(
            @PathVariable UUID userId
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogsByUserId(userId)
        );
    }

    @GetMapping("/action/{action}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByAction(
            @PathVariable AuditAction action
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogsByAction(action)
        );
    }

    @GetMapping("/service/{serviceName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByServiceName(
            @PathVariable String serviceName
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogsByServiceName(serviceName)
        );
    }
}