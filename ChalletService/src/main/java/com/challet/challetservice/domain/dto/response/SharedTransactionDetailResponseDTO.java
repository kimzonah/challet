package com.challet.challetservice.domain.dto.response;

import com.challet.challetservice.domain.entity.EmojiType;
import com.challet.challetservice.domain.entity.SharedTransaction;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Builder;

@Schema(description = "공유 거래 내역 조회 상세 DTO")
@Builder
public record SharedTransactionDetailResponseDTO(

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

    @Schema(description = "GOOD 이모지 개수")
    Long goodCount,

    @Schema(description = "SOSO 이모지 개수")
    Long sosoCount,

    @Schema(description = "BAD 이모지 개수")
    Long badCount,

    @Schema(description = "댓글 개수")
    Long commentCount,

    @Schema(description = "내가 누른 이모지")
    EmojiType userEmoji

) {

    public static SharedTransactionDetailResponseDTO fromHistoru(SharedTransaction sharedTransaction,
        Long goodCount, Long sosoCount, Long badCount, Long commentCount, EmojiType userEmoji) {

        return SharedTransactionDetailResponseDTO.builder()
            .userId(sharedTransaction.getUserChallenge().getUser().getId())
            .nickname(sharedTransaction.getUserChallenge().getUser().getNickname())
            .profileImage(sharedTransaction.getUserChallenge().getUser().getProfileImage())
            .sharedTransactionId(sharedTransaction.getId())
            .withdrawal(sharedTransaction.getWithdrawal())
            .transactionAmount(sharedTransaction.getTransactionAmount())
            .transactionDateTime(sharedTransaction.getTransactionDateTime())
            .content(sharedTransaction.getContent())
            .image(sharedTransaction.getImage())
            .goodCount(goodCount)
            .sosoCount(sosoCount)
            .badCount(badCount)
            .commentCount(commentCount)
            .userEmoji(userEmoji)
            .build();
    }

}
