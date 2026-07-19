package az.texnoera.bank.userservice.user.exception;

import az.texnoera.bank.common.exception.ResourceNotFoundException;

import java.util.UUID;

public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String email) {
        super("User not found with email: " + email);
    }

    public UserNotFoundException(UUID id) {
        super("User not found with ID: " + id);
    }
}
