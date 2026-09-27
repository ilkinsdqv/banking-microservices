package az.texnoera.bank.accountservice.account.service.impl;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AccountNumberGeneratorImplTest {
    private final AccountNumberGeneratorImpl generator = new AccountNumberGeneratorImpl();

    @Test
    void shouldGenerateSixteenDigitLuhnValidAccountNumber() {
        String accountNumber = generator.generate();
        assertThat(accountNumber).hasSize(16);
        assertThat(accountNumber).containsOnlyDigits();
        assertThat(isLuhnValid(accountNumber)).isTrue();
    }

    @Test
    void shouldGenerateDifferentAccountNumbers() {
        assertThat(generator.generate()).isNotEqualTo(generator.generate());
    }

    private static boolean isLuhnValid(String number) {
        int sum = 0;
        boolean doubleDigit = false;
        for (int i = number.length() - 1; i >= 0; i--) {
            int digit = number.charAt(i) - '0';
            if (doubleDigit) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            doubleDigit = !doubleDigit;
        }
        return sum % 10 == 0;
    }
}
