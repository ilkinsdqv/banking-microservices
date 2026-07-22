package az.texnoera.bank.userservice.user.exception;

import az.texnoera.bank.common.api.ErrorCode;
import az.texnoera.bank.common.exception.ResourceNotFoundException;

import java.util.UUID;

public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String email) {
        super(ErrorCode.USER_NOT_FOUND ,"User not found with email: " + email);
    }

    public UserNotFoundException(UUID id) {
        super(ErrorCode.USER_NOT_FOUND ,"User not found with id: " + id);
    }
}
