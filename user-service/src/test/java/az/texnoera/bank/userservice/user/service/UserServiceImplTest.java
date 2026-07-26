package az.texnoera.bank.userservice.user.service;

import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.entity.User;
import az.texnoera.bank.userservice.user.enums.Role;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
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
        User capturedUser = userCaptor.getValue();
        then(userMapper).should().toResponse(any(User.class));

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

}
