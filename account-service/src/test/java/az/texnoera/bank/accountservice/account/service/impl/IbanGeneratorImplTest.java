package az.texnoera.bank.accountservice.account.service.impl;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class IbanGeneratorImplTest {

    private final IbanGeneratorImpl generator = new IbanGeneratorImpl();

    @Test
    void shouldGenerateAzerbaijanIbanWithExpectedBankCodeAndLength() {
        String iban = generator.generate();

        assertThat(iban).startsWith("AZ");
        assertThat(iban).hasSize(28);
        assertThat(iban.substring(4, 8)).isEqualTo("NABZ");
        assertThat(iban.substring(8)).containsOnlyDigits();
    }
}
