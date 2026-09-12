package az.texnoera.bank.complaintservice.complaint.service;

import az.texnoera.bank.complaintservice.complaint.dto.request.CreateComplaintRequest;
import az.texnoera.bank.complaintservice.complaint.dto.request.ResolveComplaintRequest;
import az.texnoera.bank.complaintservice.complaint.dto.response.ComplaintResponse;
import az.texnoera.bank.complaintservice.complaint.entity.ComplaintStatus;

import java.util.List;
import java.util.UUID;

public interface ComplaintService {

    ComplaintResponse createComplaint(
            UUID userId,
            CreateComplaintRequest request
    );

    ComplaintResponse getComplaintById(UUID id);

    List<ComplaintResponse> getMyComplaints(UUID userId);

    List<ComplaintResponse> getComplaintsByStatus(
            ComplaintStatus status
    );

    List<ComplaintResponse> getAllComplaints();

    ComplaintResponse startProcessing(UUID id);

    ComplaintResponse resolveComplaint(
            UUID id,
            ResolveComplaintRequest request
    );

    ComplaintResponse closeComplaint(UUID id);
}