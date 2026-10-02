package az.texnoera.bank.accountservice.account.service.impl;

import az.texnoera.bank.accountservice.account.service.AccountNumberGenerator;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class AccountNumberGeneratorImpl implements AccountNumberGenerator {

    private static final int ACCOUNT_NUMBER_LENGTH = 16;
    private static final int BASE_LENGTH = ACCOUNT_NUMBER_LENGTH - 1;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public String generate() {

        StringBuilder number = new StringBuilder(ACCOUNT_NUMBER_LENGTH);

        for (int i = 0; i < BASE_LENGTH; i++) {
            number.append(secureRandom.nextInt(10));
        }

        number.append(calculateCheckDigit(number));

        return number.toString();
    }

    private int calculateCheckDigit(CharSequence number) {

        int sum = 0;
        boolean doubleDigit = true;

        for (int i = number.length() - 1; i >= 0; i--) {
            int digit = Character.digit(number.charAt(i), 10);

            if (doubleDigit) {
                digit *= 2;

                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            doubleDigit = !doubleDigit;
        }

        return (10 - (sum % 10)) % 10;
    }
}
