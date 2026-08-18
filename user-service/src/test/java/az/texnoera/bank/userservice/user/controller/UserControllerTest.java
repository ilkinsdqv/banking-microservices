package az.texnoera.bank.userservice.user.controller;

import az.texnoera.bank.userservice.user.dto.request.UpdateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.exception.EmailAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.FinAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.UserNotFoundException;
import az.texnoera.bank.userservice.user.service.UserService;
import az.texnoera.bank.userservice.user.testsupport.UserTestDataFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @Captor
    private ArgumentCaptor<Pageable> pageableCaptor;

    @Test
    void getUserById_ShouldReturn200_WhenUserExists() throws Exception {

        // Given
        UUID userId = UUID.randomUUID();
        UserResponse response = UserTestDataFactory.createUserResponse();

        given(userService.getUserById(userId))
                .willReturn(response);

        // When / Then
        mockMvc.perform(
                        get("/api/v1/users/{id}", userId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(response.id().toString()))
                .andExpect(jsonPath("$.email")
                        .value(response.email()))
                .andExpect(jsonPath("$.firstName")
                        .value(response.firstName()))
                .andExpect(jsonPath("$.lastName")
                        .value(response.lastName()));

        then(userService)
                .should()
                .getUserById(userId);
    }

    @Test
    void getUserById_ShouldReturn404_WhenUserDoesNotExist() throws Exception {

        // Given
        UUID userId = UUID.randomUUID();

        given(userService.getUserById(userId))
                .willThrow(new UserNotFoundException(userId));

        // When / Then
        mockMvc.perform(
                        get("/api/v1/users/{id}", userId)
                )
                .andExpect(status().isNotFound());

        then(userService)
                .should()
                .getUserById(userId);
    }

    @Test
    void createUser_ShouldReturn201_WhenRequestIsValid() throws Exception {

        // Given
        CreateUserRequest request =
                UserTestDataFactory.createUserRequest();

        UserResponse response =
                UserTestDataFactory.createUserResponse();

        given(userService.createUser(any(CreateUserRequest.class)))
                .willReturn(response);

        // When / Then
        mockMvc.perform(
                        post("/api/v1/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id")
                        .value(response.id().toString()))
                .andExpect(jsonPath("$.firstName")
                        .value(response.firstName()))
                .andExpect(jsonPath("$.lastName")
                        .value(response.lastName()))
                .andExpect(jsonPath("$.email")
                        .value(response.email()))
                .andExpect(jsonPath("$.fin")
                        .value(response.fin()));

        then(userService)
                .should()
                .createUser(any(CreateUserRequest.class));
    }

    @Test
    void createUser_ShouldReturn400_WhenRequestIsInvalid() throws Exception {

        // Given
        CreateUserRequest request = new CreateUserRequest(
                "",
                "Aliyev",
                "user@test.com",
                "Password123!",
                "ABCD123",
                "+994501111111",
                LocalDate.of(1990, 1, 1)
        );

        // When / Then
        mockMvc.perform(
                        post("/api/v1/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest());

        then(userService)
                .shouldHaveNoInteractions();
    }

    @Test
    void createUser_ShouldReturn409_WhenEmailAlreadyExists() throws Exception {

        // Given
        CreateUserRequest request =
                UserTestDataFactory.createUserRequest();

        given(userService.createUser(any(CreateUserRequest.class)))
                .willThrow(new EmailAlreadyExistsException(request.email()));

        // When / Then
        mockMvc.perform(
                        post("/api/v1/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isConflict());

        then(userService)
                .should()
                .createUser(any(CreateUserRequest.class));
    }

    @Test
    void createUser_ShouldReturn409_WhenFinAlreadyExists() throws Exception {

        // Given
        CreateUserRequest request =
                UserTestDataFactory.createUserRequest();

        given(userService.createUser(any(CreateUserRequest.class)))
                .willThrow(new FinAlreadyExistsException(request.fin()));

        // When / Then
        mockMvc.perform(
                        post("/api/v1/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isConflict());

        then(userService)
                .should()
                .createUser(any(CreateUserRequest.class));
    }

    @Test
    void getAllUsers_ShouldReturn200_WhenUsersExist() throws Exception {

        // Given
        UserResponse response = UserTestDataFactory.createUserResponse();

        Page<UserResponse> responsePage = new PageImpl<>(
                List.of(response),
                PageRequest.of(0, 10),
                1
        );

        given(userService.getAllUsers(any(Pageable.class)))
                .willReturn(responsePage);

        // When / Then
        mockMvc.perform(
                        get("/api/v1/users")
                                .param("page", "0")
                                .param("size", "10")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].id")
                        .value(response.id().toString()))
                .andExpect(jsonPath("$.content[0].email")
                        .value(response.email()))
                .andExpect(jsonPath("$.totalElements")
                        .value(1))
                .andExpect(jsonPath("$.totalPages")
                        .value(1))
                .andExpect(jsonPath("$.size")
                        .value(10))
                .andExpect(jsonPath("$.number")
                        .value(0));

        then(userService)
                .should()
                .getAllUsers(any(Pageable.class));
    }

    @Test
    void getAllUsers_ShouldUseDefaultPagination_WhenParametersAreNotProvided()
            throws Exception {

        // Given
        UserResponse response =
                UserTestDataFactory.createUserResponse();

        Page<UserResponse> responsePage = new PageImpl<>(
                List.of(response),
                PageRequest.of(
                        0,
                        10,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                ),
                1
        );

        given(userService.getAllUsers(any(Pageable.class)))
                .willReturn(responsePage);

        // When / Then
        mockMvc.perform(
                        get("/api/v1/users")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()")
                        .value(1))
                .andExpect(jsonPath("$.size")
                        .value(10))
                .andExpect(jsonPath("$.number")
                        .value(0));

        then(userService)
                .should()
                .getAllUsers(pageableCaptor.capture());

        Pageable capturedPageable = pageableCaptor.getValue();

        assertThat(capturedPageable.getPageNumber())
                .isZero();

        assertThat(capturedPageable.getPageSize())
                .isEqualTo(10);

        assertThat(capturedPageable.getSort().getOrderFor("createdAt"))
                .isNotNull();

        assertThat(capturedPageable.getSort().getOrderFor("createdAt").getDirection())
                .isEqualTo(Sort.Direction.DESC);
    }

    @Test
    void getAllUsers_ShouldReturnEmptyPage_WhenNoUsersExist() throws Exception {

        // Given
        Page<UserResponse> emptyPage = Page.empty(
                PageRequest.of(0, 10)
        );

        given(userService.getAllUsers(any(Pageable.class)))
                .willReturn(emptyPage);

        // When / Then
        mockMvc.perform(
                        get("/api/v1/users")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content").isEmpty())
                .andExpect(jsonPath("$.totalElements").value(0))
                .andExpect(jsonPath("$.totalPages").value(0))
                .andExpect(jsonPath("$.empty").value(true));

        then(userService)
                .should()
                .getAllUsers(any(Pageable.class));
    }

    @Test
    void updateUser_ShouldReturn200_WhenRequestIsValid() throws Exception {

        // Given
        UUID userId = UUID.randomUUID();

        UpdateUserRequest request =
                UserTestDataFactory.createUpdateUserRequest();

        UserResponse response =
                UserTestDataFactory.createUserResponse();

        given(userService.updateUser(
                any(UUID.class),
                any(UpdateUserRequest.class)
        )).willReturn(response);

        // When / Then
        mockMvc.perform(
                        put("/api/v1/users/{id}", userId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(response.id().toString()))
                .andExpect(jsonPath("$.firstName")
                        .value(response.firstName()))
                .andExpect(jsonPath("$.lastName")
                        .value(response.lastName()))
                .andExpect(jsonPath("$.phoneNumber")
                        .value(response.phoneNumber()));

        then(userService)
                .should()
                .updateUser(
                        eq(userId),
                        any(UpdateUserRequest.class)
                );
    }

    @Test
    void updateUser_ShouldReturn400_WhenRequestIsInvalid() throws Exception {

        // Given
        UUID userId = UUID.randomUUID();

        UpdateUserRequest request = new UpdateUserRequest(
                "",
                "Aliyev",
                "+994501111111"
        );

        // When / Then
        mockMvc.perform(
                        put("/api/v1/users/{id}", userId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest());

        then(userService)
                .shouldHaveNoInteractions();
    }

    @Test
    void updateUser_ShouldReturn404_WhenUserDoesNotExist() throws Exception {

        // Given
        UUID userId = UUID.randomUUID();

        UpdateUserRequest request =
                UserTestDataFactory.createUpdateUserRequest();

        given(userService.updateUser(
                eq(userId),
                any(UpdateUserRequest.class)
        )).willThrow(
                new UserNotFoundException(userId)
        );

        // When / Then
        mockMvc.perform(
                        put("/api/v1/users/{id}", userId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isNotFound());

        then(userService)
                .should()
                .updateUser(
                        eq(userId),
                        any(UpdateUserRequest.class)
                );
    }

    @Test
    void deleteUser_ShouldReturn204_WhenUserExists() throws Exception {

        // Given
        UUID userId = UUID.randomUUID();

        // When / Then
        mockMvc.perform(
                        delete("/api/v1/users/{id}", userId)
                )
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        then(userService)
                .should()
                .deleteUser(userId);
    }

    @Test
    void deleteUser_ShouldReturn404_WhenUserDoesNotExist() throws Exception {

        // Given
        UUID userId = UUID.randomUUID();

        willThrow(new UserNotFoundException(userId))
                .given(userService)
                .deleteUser(userId);

        // When / Then
        mockMvc.perform(
                        delete("/api/v1/users/{id}", userId)
                )
                .andExpect(status().isNotFound());

        then(userService)
                .should()
                .deleteUser(userId);
    }


}
