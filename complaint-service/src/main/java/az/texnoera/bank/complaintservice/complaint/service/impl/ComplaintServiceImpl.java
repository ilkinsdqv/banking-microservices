package az.texnoera.bank.complaintservice.complaint.service.impl;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
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
import az.texnoera.bank.complaintservice.complaint.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserServiceClient userServiceClient;
    private final ComplaintMapper complaintMapper;
    private final AuditEventPublisher auditEventPublisher;

    @Override
    @Transactional
    public ComplaintResponse createComplaint(
            UUID userId,
            CreateComplaintRequest request,
            String ipAddress
    ) {

        Boolean exists = userServiceClient.userExists(userId);

        if (!Boolean.TRUE.equals(exists)) {
            throw new IllegalArgumentException(
                    "User not found with id: " + userId
            );
        }

        Complaint complaint = new Complaint(
                userId,
                request.subject(),
                request.description(),
                request.priority()
        );

        Complaint savedComplaint =
                complaintRepository.save(complaint);

        auditEventPublisher.publish(
                userId,
                AuditAction.COMPLAINT_CREATED,
                "COMPLAINT",
                savedComplaint.getId(),
                "Complaint created: " + savedComplaint.getId(),
                AuditStatus.SUCCESS,
                ipAddress
        );

        return complaintMapper.toResponse(savedComplaint);
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(UUID id) {

        return complaintMapper.toResponse(
                getEntity(id)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(
            UUID userId
    ) {

        return complaintRepository
                .findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(complaintMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaintsByStatus(
            ComplaintStatus status
    ) {

        return complaintRepository
                .findAllByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(complaintMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {

        return complaintRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(complaintMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ComplaintResponse startProcessing(
            UUID id,
            String ipAddress
    ) {

        Complaint complaint = getEntity(id);

        complaint.startProcessing();

        auditEventPublisher.publish(
                complaint.getUserId(),
                AuditAction.COMPLAINT_STARTED,
                "COMPLAINT",
                complaint.getId(),
                "Complaint processing started: " + complaint.getId(),
                AuditStatus.SUCCESS,
                ipAddress
        );

        return complaintMapper.toResponse(complaint);
    }

    @Override
    @Transactional
    public ComplaintResponse resolveComplaint(
            UUID id,
            ResolveComplaintRequest request,
            String ipAddress
    ) {

        Complaint complaint = getEntity(id);

        complaint.resolve(request.adminResponse());

        auditEventPublisher.publish(
                complaint.getUserId(),
                AuditAction.COMPLAINT_RESOLVED,
                "COMPLAINT",
                complaint.getId(),
                "Complaint resolved: " + complaint.getId(),
                AuditStatus.SUCCESS,
                ipAddress
        );

        return complaintMapper.toResponse(complaint);
    }

    @Override
    @Transactional
    public ComplaintResponse closeComplaint(
            UUID id,
            String ipAddress
    ) {

        Complaint complaint = getEntity(id);

        complaint.close();

        auditEventPublisher.publish(
                complaint.getUserId(),
                AuditAction.COMPLAINT_CLOSED,
                "COMPLAINT",
                complaint.getId(),
                "Complaint closed: " + complaint.getId(),
                AuditStatus.SUCCESS,
                ipAddress
        );

        return complaintMapper.toResponse(complaint);
    }

    private Complaint getEntity(UUID id) {

        return complaintRepository.findById(id)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(id)
                );
    }
}