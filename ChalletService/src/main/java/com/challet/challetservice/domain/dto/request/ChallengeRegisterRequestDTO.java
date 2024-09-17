package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "챌린지 생성 요청 DTO")
public record ChallengeRegisterRequestDTO(

    @Schema(description = "챌린지 카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE",
        "SHOPPING"})
    String category,

    @Schema(description = "챌린지 제목")
    String title,

    @Schema(description = "챌린지 소비한도")
    Long spendingLimit,

    @Schema(description = "챌린지 시작날짜")
    LocalDate startDate,

    @Schema(description = "챌린지 마감날짜")
    LocalDate endDate,

    @Schema(description = "참여 가능 인원")
    Integer maxParticipants,

    @Schema(description = "공개 여부 (비공개 : 0, 공개 : 1)")
    Boolean isPublic

) {

}
