package az.texnoera.bank.userservice.user.service.impl;

import az.texnoera.bank.userservice.user.dto.request.CreateUserRequest;
import az.texnoera.bank.userservice.user.dto.response.UserResponse;
import az.texnoera.bank.userservice.user.entity.User;
import az.texnoera.bank.userservice.user.enums.Role;
import az.texnoera.bank.userservice.user.exception.EmailAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.FinAlreadyExistsException;
import az.texnoera.bank.userservice.user.exception.UserNotFoundException;
import az.texnoera.bank.userservice.user.mapper.UserMapper;
import az.texnoera.bank.userservice.user.repository.UserRepository;
import az.texnoera.bank.userservice.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }
        if (userRepository.existsByFin(request.fin())) {
            throw new FinAlreadyExistsException(request.fin());
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        User user = new User(
                request.firstName(),
                request.lastName(),
                request.email(),
                encodedPassword,
                Set.of(Role.CUSTOMER),
                request.fin(),
                request.phoneNumber(),
                request.birthDate()
        );

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    @Override
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }
}
