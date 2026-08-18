package az.texnoera.bank.userservice.user.controller;

import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.request.UpdateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(
        name = "User Management",
        description = "Operations related to user management"
)
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Operation(
            summary = "Create a new user",
            description = "Creates a new user in the system and returns the created user's details."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "User created successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failed"
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "User already exists"
            )
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @Operation(
            summary = "Get user by ID",
            description = "Retrieves the details of a user by their unique ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found"
            )
    })
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @Operation(
            summary = "Get all users",
            description = "Retrieves users with pagination and sorting support"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Users retrieved successfully"
            )
    })
    @GetMapping
    public Page<UserResponse> getAllUsers(
            @ParameterObject
            @PageableDefault(
                    page = 0,
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {
        return userService.getAllUsers(pageable);
    }

    @Operation(
            summary = "Update user",
            description = "Updates the details of an existing user by their unique ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User updated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failed"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found"
            )
    })
    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.updateUser(id, request);
    }

    @Operation(
            summary = "Delete user",
            description = "Deletes an existing user by their unique ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "User deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found"
            )
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }
}
