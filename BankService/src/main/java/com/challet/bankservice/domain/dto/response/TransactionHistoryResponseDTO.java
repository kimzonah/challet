package com.challet.bankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "챌렛계좌 내역 조회 응답 DTO")
public record TransactionHistoryResponseDTO(
    @Schema(description = "거래내역 ID")
    long id,
    @Schema(description = "거래금액")
    long transactionAmount,
    @Schema(description = "잔액")
    long balance,
    @Schema(description = "거래일시")
    LocalDateTime transactionDate,
    @Schema(description = "거래카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE",
        "SHOPPING"})
    String category
) {

}