package az.texnoera.bank.loanservice.loan.controller;

import az.texnoera.bank.loanservice.loan.dto.request.CreateLoanRequest;
import az.texnoera.bank.loanservice.loan.dto.response.LoanPaymentResponse;
import az.texnoera.bank.loanservice.loan.dto.response.LoanResponse;
import az.texnoera.bank.loanservice.loan.entity.Currency;
import az.texnoera.bank.loanservice.loan.service.LoanService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanControllerTest {

    @Mock
    private LoanService loanService;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest httpRequest;

    private LoanController controller;

    private UUID userId;
    private UUID loanId;
    private UUID accountId;

    private LoanResponse loanResponse;

    @BeforeEach
    void setUp() {

        controller = new LoanController(loanService);

        userId = UUID.randomUUID();
        loanId = UUID.randomUUID();
        accountId = UUID.randomUUID();

        loanResponse = new LoanResponse(
                loanId,
                userId,
                accountId,
                new BigDecimal("10000.00"),
                new BigDecimal("12.00"),
                12,
                new BigDecimal("888.4879"),
                new BigDecimal("10000.00"),
                Currency.AZN,
                az.texnoera.bank.loanservice.loan.entity.LoanStatus.PENDING,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    void createLoan_returnsCreated() {

        CreateLoanRequest request = new CreateLoanRequest(
                accountId,
                new BigDecimal("10000.00"),
                new BigDecimal("12.00"),
                12,
                Currency.AZN
        );

        when(authentication.getPrincipal())
                .thenReturn(userId);

        when(httpRequest.getHeader("X-Forwarded-For"))
                .thenReturn(null);

        when(httpRequest.getRemoteAddr())
                .thenReturn("127.0.0.1");

        when(loanService.createLoan(
                userId,
                request,
                "127.0.0.1"
        )).thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.createLoan(
                        authentication,
                        httpRequest,
                        request
                );

        assertEquals(
                HttpStatus.CREATED,
                response.getStatusCode()
        );

        assertSame(
                loanResponse,
                response.getBody()
        );

        verify(loanService).createLoan(
                userId,
                request,
                "127.0.0.1"
        );
    }

    @Test
    void createLoan_usesFirstIpFromForwardedFor() {

        CreateLoanRequest request = new CreateLoanRequest(
                accountId,
                new BigDecimal("10000.00"),
                new BigDecimal("12.00"),
                12,
                Currency.AZN
        );

        when(authentication.getPrincipal())
                .thenReturn(userId);

        when(httpRequest.getHeader("X-Forwarded-For"))
                .thenReturn("192.168.1.10, 10.0.0.1");

        when(loanService.createLoan(
                userId,
                request,
                "192.168.1.10"
        )).thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.createLoan(
                        authentication,
                        httpRequest,
                        request
                );

        assertEquals(
                HttpStatus.CREATED,
                response.getStatusCode()
        );

        verify(loanService).createLoan(
                userId,
                request,
                "192.168.1.10"
        );

        verify(httpRequest, never()).getRemoteAddr();
    }

    @Test
    void getLoanById_returnsOk() {

        when(loanService.getLoanById(loanId))
                .thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.getLoanById(loanId);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                loanResponse,
                response.getBody()
        );
    }

    @Test
    void getMyLoans_returnsCurrentUserLoans() {

        when(authentication.getPrincipal())
                .thenReturn(userId);

        List<LoanResponse> loans =
                List.of(loanResponse);

        when(loanService.getLoansByUserId(userId))
                .thenReturn(loans);

        ResponseEntity<List<LoanResponse>> response =
                controller.getMyLoans(authentication);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertEquals(
                loans,
                response.getBody()
        );

        verify(loanService)
                .getLoansByUserId(userId);
    }

    @Test
    void getLoansByAccountId_returnsOk() {

        List<LoanResponse> loans =
                List.of(loanResponse);

        when(loanService.getLoansByAccountId(accountId))
                .thenReturn(loans);

        ResponseEntity<List<LoanResponse>> response =
                controller.getLoansByAccountId(accountId);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertEquals(
                loans,
                response.getBody()
        );
    }

    @Test
    void approveLoan_returnsOk() {

        when(httpRequest.getHeader("X-Forwarded-For"))
                .thenReturn("10.10.10.10");

        when(loanService.approveLoan(
                loanId,
                "10.10.10.10"
        )).thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.approveLoan(
                        loanId,
                        httpRequest
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                loanResponse,
                response.getBody()
        );
    }

    @Test
    void rejectLoan_returnsOk() {

        when(httpRequest.getRemoteAddr())
                .thenReturn("127.0.0.1");

        when(loanService.rejectLoan(
                loanId,
                "127.0.0.1"
        )).thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.rejectLoan(
                        loanId,
                        httpRequest
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                loanResponse,
                response.getBody()
        );
    }

    @Test
    void activateLoan_returnsOk() {

        when(httpRequest.getRemoteAddr())
                .thenReturn("127.0.0.1");

        when(loanService.activateLoan(
                loanId,
                "127.0.0.1"
        )).thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.activateLoan(
                        loanId,
                        httpRequest
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                loanResponse,
                response.getBody()
        );
    }

    @Test
    void cancelLoan_returnsOk() {

        when(httpRequest.getRemoteAddr())
                .thenReturn("127.0.0.1");

        when(loanService.cancelLoan(
                loanId,
                "127.0.0.1"
        )).thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.cancelLoan(
                        loanId,
                        httpRequest
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                loanResponse,
                response.getBody()
        );
    }

    @Test
    void makePayment_returnsOk() {

        BigDecimal amount =
                new BigDecimal("1000.00");

        when(httpRequest.getRemoteAddr())
                .thenReturn("127.0.0.1");

        when(loanService.makePayment(
                loanId,
                amount,
                "127.0.0.1"
        )).thenReturn(loanResponse);

        ResponseEntity<LoanResponse> response =
                controller.makePayment(
                        loanId,
                        amount,
                        httpRequest
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertSame(
                loanResponse,
                response.getBody()
        );

        verify(loanService).makePayment(
                loanId,
                amount,
                "127.0.0.1"
        );
    }

    @Test
    void getPaymentHistory_returnsOk() {

        LoanPaymentResponse payment =
                mock(LoanPaymentResponse.class);

        List<LoanPaymentResponse> payments =
                List.of(payment);

        when(loanService.getPaymentHistory(loanId))
                .thenReturn(payments);

        ResponseEntity<List<LoanPaymentResponse>> response =
                controller.getPaymentHistory(loanId);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertEquals(
                payments,
                response.getBody()
        );
    }
}