package az.texnoera.bank.transactionservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class FxRateClient {

    private final RestClient restClient;

    public FxRateClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://open.er-api.com/v6")
                .build();
    }

    public BigDecimal getRate(
            String sourceCurrency,
            String destinationCurrency
    ) {
        if (sourceCurrency.equals(destinationCurrency)) {
            return BigDecimal.ONE;
        }

        FxRateResponse response = restClient.get()
                .uri("/latest/{currency}", sourceCurrency)
                .retrieve()
                .body(FxRateResponse.class);

        if (response == null ||
                response.rates() == null ||
                !response.rates().containsKey(destinationCurrency)) {

            throw new IllegalArgumentException(
                    "Exchange rate is not available for "
                            + sourceCurrency
                            + " to "
                            + destinationCurrency
            );
        }

        return response.rates().get(destinationCurrency);
    }

    private record FxRateResponse(
            String result,
            Map<String, BigDecimal> rates
    ) {
    }
}