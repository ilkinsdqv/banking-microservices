package az.texnoera.bank.userservice.user.service;

import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);
}
