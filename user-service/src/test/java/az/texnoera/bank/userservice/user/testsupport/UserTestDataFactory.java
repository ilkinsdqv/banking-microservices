package az.texnoera.bank.userservice.user.testsupport;

import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.request.UpdateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.entity.User;
import az.texnoera.bank.userservice.user.enums.Role;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public final class UserTestDataFactory {

    private static final UUID USER_ID =
            UUID.fromString("11111111-1111-1111-1111-111111111111");

    private UserTestDataFactory() {}
    public static CreateUserRequest createUserRequest() {
        return new CreateUserRequest(
                "Ali",
                "Aliyev",
                "user@test.com",
                "Password123!",
                "ABCD123",
                "+994701111111",
                LocalDate.of(1990, 1, 1)
        );
    }

    public static User createUser() {
        return new User(
                "Ali",
                "Aliyev",
                "user@test.com",
                "Password123!",
                Set.of(Role.CUSTOMER),
                "ABCD123",
                "+994701111111",
                LocalDate.of(1990, 1, 1)
        );
    }

    public static UserResponse createUserResponse() {
        return new UserResponse(
                USER_ID,
                "Ali",
                "Aliyev",
                "user@test.com",
                "ABCD123",
                "+994701111111",
                LocalDate.of(1990, 1, 1),
                Set.of(Role.CUSTOMER),
                false,
                false,
                true
        );
    }

    public static UpdateUserRequest createUpdateUserRequest() {
        return new UpdateUserRequest(
                "Updated John",
                "Updated Doe",
                "+994501234567"
        );
    }
}
