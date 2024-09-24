package com.challet.challetservice.domain.dto.response;

import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "공유 거래 내역 수동 등록 웹소켓 응답 DTO")
public record SharedTransactionRegisterResponseDTO(

    @Schema(description = "등록된 거래 내역 ID")
    Long id,

    @Schema(description = "이미지")
    String image,

    @Schema(description = "결제 항목")
    String withdrawal,

    @Schema(description = "결제 금액")
    Long transactionAmount,

    @Schema(description = "결제 내용")
    String content,

    @Schema(description = "보낸 사람 ID")
    Long userId,

    @Schema(description = "보낸 사람 닉네임")
    String nickname,

    @Schema(description = "보낸 사람 프로필")
    String profileImage
) {

    public static SharedTransactionRegisterResponseDTO from(SharedTransaction savedSharedTransaction, User user) {
        return SharedTransactionRegisterResponseDTO.builder()
            .id(savedSharedTransaction.getId())
            .image(savedSharedTransaction.getImage())
            .withdrawal(savedSharedTransaction.getWithdrawal())
            .transactionAmount(savedSharedTransaction.getTransactionAmount())
            .content(savedSharedTransaction.getContent())
            .userId(user.getId())
            .nickname(user.getNickname())
            .profileImage(user.getProfileImage())
            .build();
    }

}
