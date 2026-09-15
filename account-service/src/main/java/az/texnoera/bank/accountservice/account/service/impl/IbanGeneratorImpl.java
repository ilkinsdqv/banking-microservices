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

        String bban = BANK_CODE + accountPart;

        String checkDigits = calculateCheckDigits(bban);

        String iban = COUNTRY_CODE + checkDigits + bban;

        if (iban.length() != 28) {
            throw new IllegalStateException(
                    "Generated IBAN must contain exactly 28 characters"
            );
        }

        return iban;
    }

    private String generateAccountPart() {

        StringBuilder builder =
                new StringBuilder(ACCOUNT_PART_LENGTH);

        for (int i = 0; i < ACCOUNT_PART_LENGTH; i++) {
            builder.append(secureRandom.nextInt(10));
        }

        return builder.toString();
    }

    private String calculateCheckDigits(String bban) {

        String numericBban = convertLettersToNumbers(bban);

        String rearranged = numericBban + "292700";

        int remainder = 0;

        for (char character : rearranged.toCharArray()) {
            remainder = (remainder * 10
                    + Character.digit(character, 10)) % 97;
        }

        int checkDigits = 98 - remainder;

        return String.format("%02d", checkDigits);
    }

    private String convertLettersToNumbers(String value) {

        StringBuilder result = new StringBuilder();

        for (char character : value.toCharArray()) {

            if (Character.isLetter(character)) {
                result.append(
                        Character.toUpperCase(character) - 'A' + 10
                );
            } else {
                result.append(character);
            }
        }

        return result.toString();
    }
}