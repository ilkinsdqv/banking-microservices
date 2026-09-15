package az.texnoera.bank.userservice.user.service.impl;

import az.texnoera.bank.common.audit.AuditAction;
import az.texnoera.bank.common.audit.AuditStatus;
import az.texnoera.bank.userservice.audit.AuditEventPublisher;
import az.texnoera.bank.userservice.user.client.NotificationClient;
import az.texnoera.bank.userservice.user.dto.request.ChangePasswordRequest;
import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.request.UpdateUserRequest;
import az.texnoera.bank.userservice.user.dto.request.VerificationEmailRequest;
import az.texnoera.bank.userservice.user.dto.response.UserAuthResponse;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.entity.User;
import az.texnoera.bank.userservice.user.enums.Role;
import az.texnoera.bank.userservice.user.exception.EmailAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.FinAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.InvalidPasswordException;
import az.texnoera.bank.userservice.user.exception.UserNotFoundException;
import az.texnoera.bank.userservice.user.mapper.UserMapper;
import az.texnoera.bank.userservice.user.repository.UserRepository;
import az.texnoera.bank.userservice.user.service.EmailVerificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailVerificationService emailVerificationService;

    @Mock
    private NotificationClient notificationClient;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    private UserServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new UserServiceImpl(
                userRepository,
                userMapper,
                passwordEncoder,
                emailVerificationService,
                notificationClient,
                auditEventPublisher
        );
    }

    @Test
    void shouldCreateUserWhenEmailAndFinAreUnique() {
        CreateUserRequest request = validCreateRequest();
        UserResponse response = userResponse();

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(userRepository.existsByFin(request.fin())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(emailVerificationService.createVerificationToken(any(User.class))).thenReturn("verification-token");
        when(userMapper.toResponse(any(User.class))).thenReturn(response);

        UserResponse result = service.createUser(request, "10.0.0.5");

        assertThat(result).isEqualTo(response);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getEmail()).isEqualTo("leyla@example.com");
        assertThat(userCaptor.getValue().getPassword()).isEqualTo("encoded-password");
        assertThat(userCaptor.getValue().getRoles()).containsExactly(Role.CUSTOMER);

        verify(auditEventPublisher).publish(
                eq(null),
                eq(AuditAction.USER_REGISTERED),
                eq("USER"),
                eq(null),
                eq("User registered: null"),
                eq(AuditStatus.SUCCESS),
                eq("10.0.0.5")
        );

        verify(notificationClient).sendVerificationEmail(
                new VerificationEmailRequest(
                        "leyla@example.com",
                        "Leyla",
                        "verification-token"
                )
        );
    }

    @Test
    void shouldRejectCreateUserWhenEmailAlreadyExists() {
        CreateUserRequest request = validCreateRequest();
        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThatThrownBy(() -> service.createUser(request, "127.0.0.1"))
                .isInstanceOf(EmailAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
        verify(notificationClient, never()).sendVerificationEmail(any());
    }

    @Test
    void shouldRejectCreateUserWhenFinAlreadyExists() {
        CreateUserRequest request = validCreateRequest();
        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(userRepository.existsByFin(request.fin())).thenReturn(true);

        assertThatThrownBy(() -> service.createUser(request, "127.0.0.1"))
                .isInstanceOf(FinAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
        verify(notificationClient, never()).sendVerificationEmail(any());
    }

    @Test
    void shouldReturnUserById() {
        UUID userId = UUID.randomUUID();
        User user = user();
        UserResponse response = userResponse();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(response);

        assertThat(service.getUserById(userId)).isEqualTo(response);
    }

    @Test
    void shouldThrowWhenUserByIdDoesNotExist() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getUserById(userId))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void shouldUpdateUserProfile() {
        UUID userId = UUID.randomUUID();
        User user = user();
        UpdateUserRequest request = new UpdateUserRequest(
                "Ayla",
                "Mammadova",
                "+994501111111"
        );
        UserResponse response = userResponse();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(response);

        assertThat(service.updateUser(userId, request)).isEqualTo(response);
        assertThat(user.getFirstName()).isEqualTo("Ayla");
        assertThat(user.getLastName()).isEqualTo("Mammadova");
        assertThat(user.getPhoneNumber()).isEqualTo("+994501111111");
    }

    @Test
    void shouldChangePasswordWhenCurrentPasswordMatches() {
        UUID userId = UUID.randomUUID();
        User user = user();
        ChangePasswordRequest request =
                new ChangePasswordRequest("current-password", "new-password");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current-password", "encoded-current"))
                .thenReturn(true);
        when(passwordEncoder.encode("new-password")).thenReturn("encoded-new");

        service.changePassword(userId, request);

        assertThat(user.getPassword()).isEqualTo("encoded-new");
    }

    @Test
    void shouldRejectPasswordChangeWhenCurrentPasswordDoesNotMatch() {
        UUID userId = UUID.randomUUID();
        User user = user();
        ChangePasswordRequest request =
                new ChangePasswordRequest("wrong-password", "new-password");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-current"))
                .thenReturn(false);

        assertThatThrownBy(() -> service.changePassword(userId, request))
                .isInstanceOf(InvalidPasswordException.class);
    }

    @Test
    void shouldReturnAuthenticationUserByEmail() {
        User user = user();
        user.verifyEmail();
        when(userRepository.findByEmail("leyla@example.com"))
                .thenReturn(Optional.of(user));

        UserAuthResponse response =
                service.getUserForAuthentication("leyla@example.com");

        assertThat(response.email()).isEqualTo("leyla@example.com");
        assertThat(response.password()).isEqualTo("encoded-current");
        assertThat(response.roles()).containsExactly("CUSTOMER");
        assertThat(response.emailVerified()).isTrue();
        assertThat(response.enabled()).isTrue();
        assertThat(response.accountLocked()).isFalse();
    }

    @Test
    void shouldExposeExistsByIdResult() {
        UUID userId = UUID.randomUUID();
        when(userRepository.existsById(userId)).thenReturn(true);

        assertThat(service.existsById(userId)).isTrue();
    }

    private static CreateUserRequest validCreateRequest() {
        return new CreateUserRequest(
                "Leyla",
                "Aliyeva",
                "leyla@example.com",
                "plain-password",
                "ABC1234",
                "+994501234567",
                LocalDate.of(1995, 1, 10)
        );
    }

    private static User user() {
        return new User(
                "Leyla",
                "Aliyeva",
                "leyla@example.com",
                "encoded-current",
                Set.of(Role.CUSTOMER),
                "ABC1234",
                "+994501234567",
                LocalDate.of(1995, 1, 10)
        );
    }

    private static UserResponse userResponse() {
        return new UserResponse(
                null,
                "Leyla",
                "Aliyeva",
                "leyla@example.com",
                "ABC1234",
                "+994501234567",
                LocalDate.of(1995, 1, 10),
                Set.of(Role.CUSTOMER),
                false,
                false,
                true
        );
    }
}
