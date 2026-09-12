package az.texnoera.bank.complaintservice.complaint.service.impl;

import az.texnoera.bank.complaintservice.client.UserClient;
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
    private final UserClient userClient;
    private final ComplaintMapper complaintMapper;

    @Override
    @Transactional
    public ComplaintResponse createComplaint(
            UUID userId,
            CreateComplaintRequest request
    ) {
        Boolean exists = userClient.userExists(userId);

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

        return complaintMapper.toResponse(
                complaintRepository.save(complaint)
        );
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
    public List<ComplaintResponse> getMyComplaints(UUID userId) {
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
    public ComplaintResponse startProcessing(UUID id) {
        Complaint complaint = getEntity(id);

        complaint.startProcessing();

        return complaintMapper.toResponse(complaint);
    }

    @Override
    @Transactional
    public ComplaintResponse resolveComplaint(
            UUID id,
            ResolveComplaintRequest request
    ) {
        Complaint complaint = getEntity(id);

        complaint.resolve(request.adminResponse());

        return complaintMapper.toResponse(complaint);
    }

    @Override
    @Transactional
    public ComplaintResponse closeComplaint(UUID id) {
        Complaint complaint = getEntity(id);

        complaint.close();

        return complaintMapper.toResponse(complaint);
    }

    private Complaint getEntity(UUID id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ComplaintNotFoundException(id));
    }
}