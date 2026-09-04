package az.texnoera.bank.accountservice.account.service.impl;

import az.texnoera.bank.accountservice.account.service.IbanGenerator;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class IbanGeneratorImpl implements IbanGenerator {

    private static final String COUNTRY_CODE = "AZ";
    private static final String BANK_CODE = "NABZ";

    private static final int ACCOUNT_PART_LENGTH = 20;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public String generate() {
        String accountPart = generateAccountPart();

        return COUNTRY_CODE
                + calculateCheckDigits(accountPart)
                + BANK_CODE
                + accountPart;
    }

    private String generateAccountPart() {
        StringBuilder builder = new StringBuilder(ACCOUNT_PART_LENGTH);

        for (int i = 0; i < ACCOUNT_PART_LENGTH; i++) {
            builder.append(secureRandom.nextInt(10));
        }

        return builder.toString();
    }

    private String calculateCheckDigits(String accountPart) {
        String rearranged = BANK_CODE + accountPart + "292700";

        int remainder = 0;

        for (char character : rearranged.toCharArray()) {
            remainder = (remainder * 10 + Character.digit(character, 10)) % 97;
        }

        int checkDigits = 98 - remainder;

        return String.format("%02d", checkDigits);
    }
}