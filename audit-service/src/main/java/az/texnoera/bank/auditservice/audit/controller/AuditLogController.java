package az.texnoera.bank.auditservice.audit.controller;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.auditservice.audit.service.AuditLogService;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) AuditAction action,
            @RequestParam(required = false) String serviceName,
            @RequestParam(required = false) AuditStatus status,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogs(
                        userId,
                        action,
                        serviceName,
                        status,
                        pageable
                )
        );
    }
}