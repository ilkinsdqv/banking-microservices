package az.texnoera.bank.auditservice.audit.service.impl;

import az.texnoera.bank.auditservice.audit.dto.request.CreateAuditLogRequest;
import az.texnoera.bank.auditservice.audit.dto.response.AuditLogResponse;
import az.texnoera.bank.auditservice.audit.entity.AuditLog;
import az.texnoera.bank.auditservice.audit.exception.AuditLogNotFoundException;
import az.texnoera.bank.auditservice.audit.mapper.AuditLogMapper;
import az.texnoera.bank.auditservice.audit.repository.AuditLogRepository;
import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
    void getAuditLogs_withoutFilters_success() {

        Pageable pageable = PageRequest.of(0, 20);

        AuditLog secondAuditLog = mock(AuditLog.class);
        AuditLogResponse secondResponse = mock(AuditLogResponse.class);

        Page<AuditLog> auditLogPage = new PageImpl<>(
                List.of(auditLog, secondAuditLog),
                pageable,
                2
        );

        when(auditLogRepository.findAll(
                any(Specification.class),
                eq(pageable)
        )).thenReturn(auditLogPage);

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        when(auditLogMapper.toResponse(secondAuditLog))
                .thenReturn(secondResponse);

        Page<AuditLogResponse> result =
                auditLogService.getAuditLogs(
                        null,
                        null,
                        null,
                        null,
                        pageable
                );

        assertEquals(
                List.of(auditLogResponse, secondResponse),
                result.getContent()
        );

        assertEquals(2, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(0, result.getNumber());
        assertEquals(20, result.getSize());

        verify(auditLogRepository).findAll(
                any(Specification.class),
                eq(pageable)
        );

        verify(auditLogMapper).toResponse(auditLog);
        verify(auditLogMapper).toResponse(secondAuditLog);
    }

    @Test
    void getAuditLogs_byUserId_success() {

        Pageable pageable = PageRequest.of(0, 20);

        Page<AuditLog> auditLogPage = new PageImpl<>(
                List.of(auditLog),
                pageable,
                1
        );

        when(auditLogRepository.findAll(
                any(Specification.class),
                eq(pageable)
        )).thenReturn(auditLogPage);

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        Page<AuditLogResponse> result =
                auditLogService.getAuditLogs(
                        userId,
                        null,
                        null,
                        null,
                        pageable
                );

        assertEquals(
                List.of(auditLogResponse),
                result.getContent()
        );

        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(0, result.getNumber());
        assertEquals(20, result.getSize());

        verify(auditLogRepository).findAll(
                any(Specification.class),
                eq(pageable)
        );

        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogs_byAction_success() {

        Pageable pageable = PageRequest.of(0, 20);

        AuditAction action = AuditAction.ACCOUNT_CREATED;

        Page<AuditLog> auditLogPage = new PageImpl<>(
                List.of(auditLog),
                pageable,
                1
        );

        when(auditLogRepository.findAll(
                any(Specification.class),
                eq(pageable)
        )).thenReturn(auditLogPage);

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        Page<AuditLogResponse> result =
                auditLogService.getAuditLogs(
                        null,
                        action,
                        null,
                        null,
                        pageable
                );

        assertEquals(
                List.of(auditLogResponse),
                result.getContent()
        );

        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(0, result.getNumber());
        assertEquals(20, result.getSize());

        verify(auditLogRepository).findAll(
                any(Specification.class),
                eq(pageable)
        );

        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogs_byServiceName_success() {

        Pageable pageable = PageRequest.of(0, 20);

        String serviceName = "ACCOUNT-SERVICE";

        Page<AuditLog> auditLogPage = new PageImpl<>(
                List.of(auditLog),
                pageable,
                1
        );

        when(auditLogRepository.findAll(
                any(Specification.class),
                eq(pageable)
        )).thenReturn(auditLogPage);

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        Page<AuditLogResponse> result =
                auditLogService.getAuditLogs(
                        null,
                        null,
                        serviceName,
                        null,
                        pageable
                );

        assertEquals(
                List.of(auditLogResponse),
                result.getContent()
        );

        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(0, result.getNumber());
        assertEquals(20, result.getSize());

        verify(auditLogRepository).findAll(
                any(Specification.class),
                eq(pageable)
        );

        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogs_byStatus_success() {

        Pageable pageable = PageRequest.of(0, 20);

        AuditStatus status = AuditStatus.SUCCESS;

        Page<AuditLog> auditLogPage = new PageImpl<>(
                List.of(auditLog),
                pageable,
                1
        );

        when(auditLogRepository.findAll(
                any(Specification.class),
                eq(pageable)
        )).thenReturn(auditLogPage);

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        Page<AuditLogResponse> result =
                auditLogService.getAuditLogs(
                        null,
                        null,
                        null,
                        status,
                        pageable
                );

        assertEquals(
                List.of(auditLogResponse),
                result.getContent()
        );

        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(0, result.getNumber());
        assertEquals(20, result.getSize());

        verify(auditLogRepository).findAll(
                any(Specification.class),
                eq(pageable)
        );

        verify(auditLogMapper).toResponse(auditLog);
    }

    @Test
    void getAuditLogs_withAllFilters_success() {

        Pageable pageable = PageRequest.of(1, 10);

        AuditAction action = AuditAction.USER_LOGIN;
        AuditStatus status = AuditStatus.SUCCESS;
        String serviceName = "auth-service";

        Page<AuditLog> auditLogPage = new PageImpl<>(
                List.of(auditLog),
                pageable,
                11
        );

        when(auditLogRepository.findAll(
                any(Specification.class),
                eq(pageable)
        )).thenReturn(auditLogPage);

        when(auditLogMapper.toResponse(auditLog))
                .thenReturn(auditLogResponse);

        Page<AuditLogResponse> result =
                auditLogService.getAuditLogs(
                        userId,
                        action,
                        serviceName,
                        status,
                        pageable
                );

        assertEquals(
                List.of(auditLogResponse),
                result.getContent()
        );

        assertEquals(11, result.getTotalElements());
        assertEquals(2, result.getTotalPages());
        assertEquals(1, result.getNumber());
        assertEquals(10, result.getSize());

        verify(auditLogRepository).findAll(
                any(Specification.class),
                eq(pageable)
        );

        verify(auditLogMapper).toResponse(auditLog);
    }
}