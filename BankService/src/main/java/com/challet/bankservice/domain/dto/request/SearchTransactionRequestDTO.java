package com.challet.bankservice.domain.dto.request;

import lombok.Builder;

@Builder
public record SearchTransactionRequestDTO(Long accountId, String deposit, int page, int size) {

    public static SearchTransactionRequestDTO of(Long accountId, String deposit, int page,
        int size) {

        return SearchTransactionRequestDTO.builder()
            .accountId(accountId)
            .deposit(deposit)
            .page(page)
            .size(size)
            .build();
    }
}
