package com.challet.bankservice.domain.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionHistoryResponseDTO {
    private long id;
    private long transactionAmount; // 거래금액
    private long balance;           // 잔액
    private LocalDateTime transactionDate; // 거래일시
    private String category;
}