package com.challet.challetservice.domain.dto.response;

import com.challet.challetservice.domain.dto.request.ActionType;
import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.entity.EmojiType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "이모지 응답 DTO")
@Builder
public record EmojiResponseDTO(

    @Schema(description = "공유 거래 내역 ID")
    Long sharedTransactionId,

    @Schema(description = "이모지")
    EmojiType type,

    @Schema(description = "요청 후 변화된 카운트")
    Long count,

    @Schema(description = "(update시)기존 이모지")
    EmojiType beforeType,

    @Schema(description = "(update시)요청 후 기존 이모지의 변화된 카운트")
    Long beforeCount

) {

    public static EmojiResponseDTO of(EmojiRequestDTO request, Long count) {
        return EmojiResponseDTO.builder()
            .sharedTransactionId(request.sharedTransactionId())
            .type(request.type())
            .count(count)
            .build();

    }

    public static EmojiResponseDTO of(EmojiRequestDTO request, Long count, Long beforeCount) {
        return EmojiResponseDTO.builder()
            .sharedTransactionId(request.sharedTransactionId())
            .type(request.type())
            .count(count)
            .beforeType(request.beforeType())
            .beforeCount(beforeCount)
            .build();
    }

}
