package az.texnoera.bank.auditservice.audit.service.impl;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import az.texnoera.bank.auditservice.audit.exception.AuditLogNotFoundException;
import az.texnoera.bank.auditservice.audit.mapper.AuditLogMapper;
import az.texnoera.bank.auditservice.audit.repository.AuditLogRepository;
import az.texnoera.bank.common.audit.AuditAction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceImplTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private AuditLogMapper auditLogMapper;

    @Mock
    private CreateAuditLogRequest createRequest;

    @Mock
    private AuditLog auditLog;

    @Mock
    private AuditLogResponse auditLogResponse;

    private AuditLogServiceImpl auditLogService;

    private UUID auditId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        auditLogService = new AuditLogServiceImpl(
                auditLogRepository,
                auditLogMapper
        );

        auditId = UUID.randomUUID();
        userId = UUID.randomUUID();
    }

    @Test
    void createAuditLog_success() {

        when(auditLogMapper.toEntity(createRequest))
                .thenReturn(auditLog);

        when(auditLogRepository.save(auditLog))
                .thenReturn(auditLog);

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        AuditLogResponse result =
                auditLogService.createAuditLog(createRequest);

        assertSame(auditLogResponse, result);

        verify(auditLogMapper).toEntity(createRequest);
        verify(auditLogRepository).save(auditLog);
        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogById_success() {

        when(auditLogRepository.findById(auditId))
                .thenReturn(Optional.of(auditLog));

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        AuditLogResponse result =
                auditLogService.getAuditLogById(auditId);

        assertSame(auditLogResponse, result);

        verify(auditLogRepository).findById(auditId);
        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogById_notFound() {

        when(auditLogRepository.findById(auditId))
                .thenReturn(Optional.empty());

        assertThrows(
                AuditLogNotFoundException.class,
                () -> auditLogService.getAuditLogById(auditId)
        );

        verify(auditLogRepository).findById(auditId);
        verify(auditLogMapper, never()).toResponse(any());
    }

    @Test
    void getAllAuditLogs_success() {

        AuditLog secondAuditLog = mock(AuditLog.class);
        AuditLogResponse secondResponse = mock(AuditLogResponse.class);

        when(auditLogRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(auditLog, secondAuditLog));

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        when(auditLogMapper.toResponse(secondAuditLog))
                .thenReturn(secondResponse);

        List<AuditLogResponse> result =
                auditLogService.getAllAuditLogs();

        assertEquals(
                List.of(auditLogResponse, secondResponse),
                result
        );

        verify(auditLogRepository)
                .findAllByOrderByCreatedAtDesc();

        verify(auditLogMapper).toResponse(auditLog);
        verify(auditLogMapper).toResponse(secondAuditLog);
    }

    @Test
    void getAuditLogsByUserId_success() {

        when(auditLogRepository
                .findAllByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(List.of(auditLog));

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        List<AuditLogResponse> result =
                auditLogService.getAuditLogsByUserId(userId);

        assertEquals(
                List.of(auditLogResponse),
                result
        );

        verify(auditLogRepository)
                .findAllByUserIdOrderByCreatedAtDesc(userId);

        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogsByAction_success() {

        AuditAction action = AuditAction.ACCOUNT_CREATED;

        when(auditLogRepository
                .findAllByActionOrderByCreatedAtDesc(action))
                .thenReturn(List.of(auditLog));

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        List<AuditLogResponse> result =
                auditLogService.getAuditLogsByAction(action);

        assertEquals(
                List.of(auditLogResponse),
                result
        );

        verify(auditLogRepository)
                .findAllByActionOrderByCreatedAtDesc(action);

        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogsByServiceName_success() {

        String serviceName = "ACCOUNT-SERVICE";

        when(auditLogRepository
                .findAllByServiceNameOrderByCreatedAtDesc(serviceName))
                .thenReturn(List.of(auditLog));

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        List<AuditLogResponse> result =
                auditLogService.getAuditLogsByServiceName(serviceName);

        assertEquals(
                List.of(auditLogResponse),
                result
        );

        verify(auditLogRepository)
                .findAllByServiceNameOrderByCreatedAtDesc(serviceName);

        verify(auditLogMapper).toResponse(auditLog);
    }
}