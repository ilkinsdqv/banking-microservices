package az.texnoera.bank.complaintservice.complaint.service.impl;

import az.texnoera.bank.complaintservice.audit.AuditEventPublisher;
import az.texnoera.bank.complaintservice.client.UserServiceClient;
import az.texnoera.bank.complaintservice.complaint.dto.request.CreateComplaintRequest;
import az.texnoera.bank.complaintservice.complaint.dto.request.ResolveComplaintRequest;
import az.texnoera.bank.complaintservice.complaint.dto.response.ComplaintResponse;
import az.texnoera.bank.complaintservice.complaint.entity.Complaint;
import az.texnoera.bank.complaintservice.complaint.entity.ComplaintStatus;
import az.texnoera.bank.complaintservice.complaint.exception.ComplaintNotFoundException;
import az.texnoera.bank.complaintservice.complaint.mapper.ComplaintMapper;
import az.texnoera.bank.complaintservice.complaint.repository.ComplaintRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceImplTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private ComplaintMapper complaintMapper;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    @Mock
    private CreateComplaintRequest createRequest;

    @Mock
    private ResolveComplaintRequest resolveRequest;

    @Mock
    private Complaint complaint;

    @Mock
    private ComplaintResponse complaintResponse;

    private ComplaintServiceImpl complaintService;

    private UUID userId;
    private UUID complaintId;

    @BeforeEach
    void setUp() {

        complaintService = new ComplaintServiceImpl(
                complaintRepository,
                userServiceClient,
                complaintMapper,
                auditEventPublisher
        );

        userId = UUID.randomUUID();
        complaintId = UUID.randomUUID();
    }

    @Test
    void createComplaint_success() {

        when(userServiceClient.userExists(userId))
                .thenReturn(true);

        when(createRequest.subject())
                .thenReturn("Card issue");

        when(createRequest.description())
                .thenReturn("My card is not working");

        when(createRequest.priority())
                .thenReturn(null);

        when(complaintRepository.save(any(Complaint.class)))
                .thenReturn(complaint);

        when(complaint.getId())
                .thenReturn(complaintId);

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        ComplaintResponse result =
                complaintService.createComplaint(
                        userId,
                        createRequest,
                        "127.0.0.1"
                );

        assertSame(
                complaintResponse,
                result
        );

        ArgumentCaptor<Complaint> captor =
                ArgumentCaptor.forClass(Complaint.class);

        verify(complaintRepository)
                .save(captor.capture());

        Complaint savedComplaint =
                captor.getValue();

        assertNotNull(savedComplaint);

        verify(userServiceClient)
                .userExists(userId);

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("COMPLAINT"),
                eq(complaintId),
                contains("Complaint created"),
                any(),
                eq("127.0.0.1")
        );

        verify(complaintMapper)
                .toResponse(complaint);
    }

    @Test
    void createComplaint_userNotFound_throwsException() {

        when(userServiceClient.userExists(userId))
                .thenReturn(false);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> complaintService.createComplaint(
                                userId,
                                createRequest,
                                "127.0.0.1"
                        )
                );

        assertEquals(
                "User not found with id: " + userId,
                exception.getMessage()
        );

        verify(complaintRepository, never())
                .save(any());

        verify(auditEventPublisher, never())
                .publish(
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any()
                );
    }

    @Test
    void createComplaint_nullUserExists_throwsException() {

        when(userServiceClient.userExists(userId))
                .thenReturn(null);

        assertThrows(
                IllegalArgumentException.class,
                () -> complaintService.createComplaint(
                        userId,
                        createRequest,
                        "127.0.0.1"
                )
        );

        verify(complaintRepository, never())
                .save(any());
    }

    @Test
    void getComplaintById_success() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.of(complaint));

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        ComplaintResponse result =
                complaintService.getComplaintById(
                        complaintId
                );

        assertSame(
                complaintResponse,
                result
        );

        verify(complaintRepository)
                .findById(complaintId);

        verify(complaintMapper)
                .toResponse(complaint);
    }

    @Test
    void getComplaintById_notFound() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.empty());

        assertThrows(
                ComplaintNotFoundException.class,
                () -> complaintService.getComplaintById(
                        complaintId
                )
        );

        verify(complaintMapper, never())
                .toResponse(any());
    }

    @Test
    void getMyComplaints_success() {

        Complaint secondComplaint = mock(Complaint.class);

        ComplaintResponse secondResponse =
                mock(ComplaintResponse.class);

        when(complaintRepository
                .findAllByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(
                        List.of(
                                complaint,
                                secondComplaint
                        )
                );

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        when(complaintMapper.toResponse(secondComplaint))
                .thenReturn(secondResponse);

        List<ComplaintResponse> result =
                complaintService.getMyComplaints(userId);

        assertEquals(
                List.of(
                        complaintResponse,
                        secondResponse
                ),
                result
        );

        verify(complaintRepository)
                .findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    void getComplaintsByStatus_success() {

        ComplaintStatus status =
                ComplaintStatus.OPEN;

        when(complaintRepository
                .findAllByStatusOrderByCreatedAtDesc(status))
                .thenReturn(List.of(complaint));

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        List<ComplaintResponse> result =
                complaintService.getComplaintsByStatus(
                        status
                );

        assertEquals(
                List.of(complaintResponse),
                result
        );

        verify(complaintRepository)
                .findAllByStatusOrderByCreatedAtDesc(status);
    }

    @Test
    void getAllComplaints_success() {

        when(complaintRepository
                .findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(complaint));

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        List<ComplaintResponse> result =
                complaintService.getAllComplaints();

        assertEquals(
                List.of(complaintResponse),
                result
        );

        verify(complaintRepository)
                .findAllByOrderByCreatedAtDesc();
    }

    @Test
    void startProcessing_success() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.of(complaint));

        when(complaint.getId())
                .thenReturn(complaintId);

        when(complaint.getUserId())
                .thenReturn(userId);

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        ComplaintResponse result =
                complaintService.startProcessing(
                        complaintId,
                        "127.0.0.1"
                );

        assertSame(
                complaintResponse,
                result
        );

        verify(complaint)
                .startProcessing();

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("COMPLAINT"),
                eq(complaintId),
                contains("Complaint processing started"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void resolveComplaint_success() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.of(complaint));

        when(complaint.getId())
                .thenReturn(complaintId);

        when(complaint.getUserId())
                .thenReturn(userId);

        when(resolveRequest.adminResponse())
                .thenReturn("Issue resolved successfully");

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        ComplaintResponse result =
                complaintService.resolveComplaint(
                        complaintId,
                        resolveRequest,
                        "127.0.0.1"
                );

        assertSame(
                complaintResponse,
                result
        );

        verify(complaint)
                .resolve("Issue resolved successfully");

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("COMPLAINT"),
                eq(complaintId),
                contains("Complaint resolved"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void closeComplaint_success() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.of(complaint));

        when(complaint.getId())
                .thenReturn(complaintId);

        when(complaint.getUserId())
                .thenReturn(userId);

        when(complaintMapper.toResponse(complaint))
                .thenReturn(complaintResponse);

        ComplaintResponse result =
                complaintService.closeComplaint(
                        complaintId,
                        "127.0.0.1"
                );

        assertSame(
                complaintResponse,
                result
        );

        verify(complaint)
                .close();

        verify(auditEventPublisher).publish(
                eq(userId),
                any(),
                eq("COMPLAINT"),
                eq(complaintId),
                contains("Complaint closed"),
                any(),
                eq("127.0.0.1")
        );
    }

    @Test
    void startProcessing_notFound_throwsException() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.empty());

        assertThrows(
                ComplaintNotFoundException.class,
                () -> complaintService.startProcessing(
                        complaintId,
                        "127.0.0.1"
                )
        );

        verify(complaint, never())
                .startProcessing();

        verify(auditEventPublisher, never())
                .publish(
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any()
                );
    }

    @Test
    void resolveComplaint_notFound_throwsException() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.empty());

        assertThrows(
                ComplaintNotFoundException.class,
                () -> complaintService.resolveComplaint(
                        complaintId,
                        resolveRequest,
                        "127.0.0.1"
                )
        );

        verify(complaint, never())
                .resolve(any());

        verify(auditEventPublisher, never())
                .publish(
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any()
                );
    }

    @Test
    void closeComplaint_notFound_throwsException() {

        when(complaintRepository.findById(complaintId))
                .thenReturn(Optional.empty());

        assertThrows(
                ComplaintNotFoundException.class,
                () -> complaintService.closeComplaint(
                        complaintId,
                        "127.0.0.1"
                )
        );

        verify(complaint, never())
                .close();

        verify(auditEventPublisher, never())
                .publish(
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any()
                );
    }
}