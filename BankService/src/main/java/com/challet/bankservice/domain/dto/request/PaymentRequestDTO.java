package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "결제 요청 데이터 DTO")
public record PaymentRequestDTO(

    @Schema(description = "결제 금액")
    Long transactionAmount,

    @Schema(description = "결제 장소")
    String withdrawal,

    @Schema(description = "결제 카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE",
        "SHOPPING"})
    String category
) {

}