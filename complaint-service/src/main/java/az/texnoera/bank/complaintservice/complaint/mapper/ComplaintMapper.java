package az.texnoera.bank.complaintservice.complaint.mapper;

import az.texnoera.bank.complaintservice.complaint.dto.response.ComplaintResponse;
import az.texnoera.bank.complaintservice.complaint.entity.Complaint;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ComplaintMapper {

    ComplaintResponse toResponse(Complaint complaint);
}