package az.texnoera.bank.loanservice.client;

import az.texnoera.bank.loanservice.client.dto.LoanUserLookupResponse;
import az.texnoera.bank.loanservice.config.FeignSecurityConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;

@FeignClient(
        name = "user-service",
        configuration = FeignSecurityConfig.class
)
public interface UserClient {

    @GetMapping("/api/v1/users/internal/lookup")
    LoanUserLookupResponse findByFinAndBirthDate(
            @RequestParam String fin,
            @RequestParam LocalDate birthDate
    );
}
