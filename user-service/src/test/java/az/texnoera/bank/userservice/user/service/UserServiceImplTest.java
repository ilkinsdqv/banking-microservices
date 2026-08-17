package az.texnoera.bank.userservice.user.service;

import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.request.UpdateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.entity.User;
import az.texnoera.bank.userservice.user.enums.Role;
import az.texnoera.bank.userservice.user.exception.EmailAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.FinAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.UserNotFoundException;
import az.texnoera.bank.userservice.user.mapper.UserMapper;
import az.texnoera.bank.userservice.user.repository.UserRepository;
import az.texnoera.bank.userservice.user.service.impl.UserServiceImpl;
import az.texnoera.bank.userservice.user.testsupport.UserTestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    @Captor
    private ArgumentCaptor<User> userCaptor;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void createUser_ShouldReturnUserResponse_WhenRequestIsValid() {
        //Given
        CreateUserRequest request = UserTestDataFactory.createUserRequest();
        User user = UserTestDataFactory.createUser();
        UserResponse response = UserTestDataFactory.createUserResponse();

        given(userRepository.existsByEmail(request.email()))
                .willReturn(false);

        given(userRepository.existsByFin(request.fin()))
                .willReturn(false);

        given(passwordEncoder.encode(request.password()))
                .willReturn("encodedPassword");

        given(userRepository.save(any(User.class)))
                .willReturn(user);

        given(userMapper.toResponse(any(User.class)))
                .willReturn(response);

        //When
        UserResponse result = userService.createUser(request);

        //Then
        then(userRepository).should().existsByEmail(request.email());
        then(userRepository).should().existsByFin(request.fin());
        then(passwordEncoder).should().encode(request.password());
        then(userRepository).should().save(userCaptor.capture());
        then(userMapper).should().toResponse(any(User.class));

        User capturedUser = userCaptor.getValue();

        assertThat(result).isEqualTo(response);
        assertThat(capturedUser.getFirstName())
                .isEqualTo(request.firstName());

        assertThat(capturedUser.getLastName())
                .isEqualTo(request.lastName());

        assertThat(capturedUser.getEmail())
                .isEqualTo(request.email());

        assertThat(capturedUser.getFin())
                .isEqualTo(request.fin());

        assertThat(capturedUser.getPhoneNumber())
                .isEqualTo(request.phoneNumber());

        assertThat(capturedUser.getBirthDate())
                .isEqualTo(request.birthDate());

        assertThat(capturedUser.getPassword())
                .isEqualTo("encodedPassword");

        assertThat(capturedUser.getRoles())
                .containsExactly(Role.CUSTOMER);
    }

    @Test
    void createUser_ShouldThrowEmailAlreadyExistsException_WhenEmailAlreadyExists() {

        // Given
        CreateUserRequest request = UserTestDataFactory.createUserRequest();

        given(userRepository.existsByEmail(request.email()))
                .willReturn(true);

        // When / Then
        assertThatThrownBy(() -> userService.createUser(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining(request.email());

        then(userRepository)
                .should()
                .existsByEmail(request.email());

        then(userRepository)
                .shouldHaveNoMoreInteractions();

        then(passwordEncoder)
                .shouldHaveNoInteractions();

        then(userMapper)
                .shouldHaveNoInteractions();
    }

    @Test
    void createUser_ShouldThrowFinAlreadyExistsException_WhenFinAlreadyExists() {

        // Given
        CreateUserRequest request = UserTestDataFactory.createUserRequest();

        given(userRepository.existsByEmail(request.email()))
                .willReturn(false);

        given(userRepository.existsByFin(request.fin()))
                .willReturn(true);

        // When / Then
        assertThatThrownBy(() -> userService.createUser(request))
                .isInstanceOf(FinAlreadyExistsException.class)
                .hasMessageContaining(request.fin());

        then(userRepository)
                .should()
                .existsByEmail(request.email());

        then(userRepository)
                .should()
                .existsByFin(request.fin());

        then(passwordEncoder)
                .shouldHaveNoInteractions();

        then(userMapper)
                .shouldHaveNoInteractions();

        then(userRepository)
                .shouldHaveNoMoreInteractions();
    }

    @Test
    void getUserById_ShouldReturnUserResponse_WhenUserExists() {

        // Given
        UUID userId = UUID.randomUUID();
        User user = UserTestDataFactory.createUser();
        UserResponse response = UserTestDataFactory.createUserResponse();

        given(userRepository.findById(userId))
                .willReturn(Optional.of(user));

        given(userMapper.toResponse(user))
                .willReturn(response);

        // When
        UserResponse result = userService.getUserById(userId);

        // Then
        assertThat(result)
                .isEqualTo(response);

        then(userRepository)
                .should()
                .findById(userId);

        then(userMapper)
                .should()
                .toResponse(user);
    }

    @Test
    void getUserById_ShouldThrowUserNotFoundException_WhenUserDoesNotExist() {

        // Given
        UUID userId = UUID.randomUUID();

        given(userRepository.findById(userId))
                .willReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> userService.getUserById(userId))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining(userId.toString());

        then(userRepository)
                .should()
                .findById(userId);

        then(userMapper)
                .shouldHaveNoInteractions();
    }


    @Test
    void getAllUsers_ShouldReturnUserResponses_WhenUsersExist() {

        // Given
        Pageable pageable = PageRequest.of(0, 10);

        User user = UserTestDataFactory.createUser();
        UserResponse response = UserTestDataFactory.createUserResponse();

        Page<User> userPage = new PageImpl<>(
                List.of(user),
                pageable,
                1
        );

        given(userRepository.findAll(pageable))
                .willReturn(userPage);

        given(userMapper.toResponse(user))
                .willReturn(response);

        // When
        Page<UserResponse> result = userService.getAllUsers(pageable);

        // Then
        assertThat(result)
                .isNotNull();

        assertThat(result.getContent())
                .containsExactly(response);

        assertThat(result.getTotalElements())
                .isEqualTo(1);

        then(userRepository)
                .should()
                .findAll(pageable);

        then(userMapper)
                .should()
                .toResponse(user);
    }

    @Test
    void getAllUsers_ShouldReturnEmptyPage_WhenNoUsersExist() {

        // Given
        Pageable pageable = PageRequest.of(0, 10);

        Page<User> emptyPage = Page.empty(pageable);

        given(userRepository.findAll(pageable))
                .willReturn(emptyPage);

        // When
        Page<UserResponse> result = userService.getAllUsers(pageable);

        // Then
        assertThat(result)
                .isNotNull();

        assertThat(result)
                .isEmpty();

        assertThat(result.getTotalElements())
                .isZero();

        then(userRepository)
                .should()
                .findAll(pageable);

        then(userMapper)
                .shouldHaveNoInteractions();
    }

    @Test
    void updateUser_ShouldReturnUpdatedUserResponse_WhenUserExists() {

        // Given
        UUID userId = UUID.randomUUID();
        UpdateUserRequest request = UserTestDataFactory.createUpdateUserRequest();

        User user = UserTestDataFactory.createUser();
        UserResponse response = UserTestDataFactory.createUserResponse();

        given(userRepository.findById(userId))
                .willReturn(Optional.of(user));

        given(userMapper.toResponse(user))
                .willReturn(response);

        // When
        UserResponse result = userService.updateUser(userId, request);

        // Then
        assertThat(result)
                .isEqualTo(response);

        assertThat(user.getFirstName())
                .isEqualTo(request.firstName());

        assertThat(user.getLastName())
                .isEqualTo(request.lastName());

        assertThat(user.getPhoneNumber())
                .isEqualTo(request.phoneNumber());

        then(userRepository)
                .should()
                .findById(userId);

        then(userMapper)
                .should()
                .toResponse(user);
    }

    @Test
    void updateUser_ShouldThrowUserNotFoundException_WhenUserDoesNotExist() {

        // Given
        UUID userId = UUID.randomUUID();
        UpdateUserRequest request = UserTestDataFactory.createUpdateUserRequest();

        given(userRepository.findById(userId))
                .willReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> userService.updateUser(userId, request))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining(userId.toString());

        then(userRepository)
                .should()
                .findById(userId);

        then(userMapper)
                .shouldHaveNoInteractions();
    }

    @Test
    void deleteUser_ShouldDeleteUser_WhenUserExists() {

        // Given
        UUID userId = UUID.randomUUID();
        User user = UserTestDataFactory.createUser();

        given(userRepository.findById(userId))
                .willReturn(Optional.of(user));

        // When
        userService.deleteUser(userId);

        // Then
        then(userRepository)
                .should()
                .findById(userId);

        then(userRepository)
                .should()
                .delete(user);
    }

    @Test
    void deleteUser_ShouldThrowUserNotFoundException_WhenUserDoesNotExist() {

        // Given
        UUID userId = UUID.randomUUID();

        given(userRepository.findById(userId))
                .willReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> userService.deleteUser(userId))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining(userId.toString());

        then(userRepository)
                .should()
                .findById(userId);

        then(userRepository)
                .shouldHaveNoMoreInteractions();
    }

}
