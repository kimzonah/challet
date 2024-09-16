package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "공유 거래 내역 목록 조회 응답 DTO")
public record SharedTransactionDetailResponseDTO(

        @Schema(description = "내가 공유한 거래 내역인지 여부")
        Boolean isMine,

        @Schema(description = "공유자 ID")
        Long userId,

        @Schema(description = "공유자 닉네임")
        String nickname,

        @Schema(description = "공유자 프로필 이미지")
        String profileImage,

        @Schema(description = "공유 거래 내역 ID")
        Long sharedTransactionId,

        @Schema(description = "출금처")
        String withdrawal,

        @Schema(description = "거래 금액")
        Long transactionAmount,

        @Schema(description = "거래일시")
        LocalDateTime transactionDateTime,

        @Schema(description = "내용")
        String content,

        @Schema(description = "이미지")
        String image,

        @Schema(description = "3점 이모지 갯수")
        Integer threeEmojiNum,

        @Schema(description = "2점 이모지 갯수")
        Integer twoEmojiNum,

        @Schema(description = "1점 이모지 갯수")
        Integer oneEmojiNum,

        @Schema(description = "댓글 갯수")
        Integer commentNum,

        @Schema(description = "내가 누른 이모지")
        Integer pushedEmoji

) {}
