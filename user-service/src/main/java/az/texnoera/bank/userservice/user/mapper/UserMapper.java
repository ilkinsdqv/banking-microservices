package az.texnoera.bank.userservice.user.mapper;

import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
