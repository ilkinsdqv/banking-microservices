package az.texnoera.bank.userservice.user.service;

import az.texnoera.bank.userservice.user.dto.request.ChangePasswordRequest;
import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.request.UpdateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserAuthResponse;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);
    UserResponse getUserById(UUID id);
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse updateUser(UUID id, UpdateUserRequest request);
    void deleteUser(UUID id);
    void changePassword(UUID id, ChangePasswordRequest request);
    void enableUser(UUID id);
    void disableUser(UUID id);
    void lockUser(UUID id);
    void unlockUser(UUID id);
    UserAuthResponse getUserForAuthentication(String email);
}
