package az.texnoera.bank.common.exception;

import az.texnoera.bank.common.api.ErrorCode;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BusinessExceptionTest {

    @Test
    void shouldExposeErrorCodeAndMessage() {
        BusinessException exception =
                new TestBusinessException(ErrorCode.BAD_REQUEST, "bad request");

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.BAD_REQUEST);
        assertThat(exception).hasMessage("bad request");
    }

    private static final class TestBusinessException extends BusinessException {

        private TestBusinessException(ErrorCode errorCode, String message) {
            super(errorCode, message);
        }
    }
}
