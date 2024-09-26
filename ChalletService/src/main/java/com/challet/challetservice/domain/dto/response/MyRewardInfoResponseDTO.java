package com.challet.challetservice.domain.dto.response;

import com.challet.challetservice.domain.entity.Category;
import com.challet.challetservice.domain.entity.Reward;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "내 리워드 정보 DTO")
@Builder
public record MyRewardInfoResponseDTO(

    @Schema(description = "리워드ID")
    Long rewardId,

    @Schema(description = "리워드 종류 (실패 : 0, 성공 : 1)")
    Boolean type,

    @Schema(description = "챌린지 카테고리")
    Category category

) {

    public static MyRewardInfoResponseDTO fromReward(Reward reward) {
        return MyRewardInfoResponseDTO.builder()
            .rewardId(reward.getId())
            .type(reward.getType())
            .category(reward.getChallenge().getCategory())
            .build();
    }

}
