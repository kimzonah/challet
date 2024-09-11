package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "공유 거래 내역 목록 조회 응답 DTO")
public class SharedTransactionListResponseDTO {

    @Schema(description = "내가 공유한 거래 내역인지 여부")
    private boolean isMine;

    @Schema(description = "공유자 ID")
    private Long userId;

    @Schema(description = "공유자 닉네임")
    private String nickname;

    @Schema(description = "공유자 프로필 이미지")
    private String profileImage;

    @Schema(description = "공유 거래 내역 ID")
    private Long sharedTransactionId;

    @Schema(description = "출금처")
    private String withdrawal;

    @Schema(description = "거래 금액")
    private Long transactionAmount;

    @Schema(description = "거래일시")
    private LocalDateTime transactionDateTime;

    @Schema(description = "내용")
    private String content;

    @Schema(description = "이미지")
    private String image;

}
