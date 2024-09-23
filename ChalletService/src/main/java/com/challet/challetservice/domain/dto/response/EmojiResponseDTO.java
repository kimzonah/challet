package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record EmojiResponseDTO(

    @Schema(description = "공유 거래 내역 ID")
    Long sharedTransactionId,

    @Schema(description = "이모지")
    String emoji,

    @Schema(description = "요청 후 변화된 카운트")
    Integer count

) {

//    public static EmojiResponseDTO of(final Long sharedTransactionId, final String emoji, final Integer count) {
//
//    }

}
