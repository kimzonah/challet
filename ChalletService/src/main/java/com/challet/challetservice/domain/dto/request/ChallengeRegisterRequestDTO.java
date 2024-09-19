package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(description = "챌린지 생성 요청 DTO")
public record ChallengeRegisterRequestDTO(

    @Schema(description = "챌린지 카테고리", allowableValues = {"DELIVERY", "TRANSPORT", "COFFEE",
        "SHOPPING"})
    @NotBlank(message = "챌린지 카테고리는 필수 입력값 입니다.")
    String category,

    @Schema(description = "챌린지 제목")
    @NotBlank(message = "챌린지 제목은 필수 입력값 입니다.")
    String title,

    @Schema(description = "챌린지 소비한도")
    @NotBlank(message = "소비한도는 필수 입력값 입니다.")
    Long spendingLimit,

    @Schema(description = "챌린지 시작날짜")
    @NotBlank(message = "챌린지 시작날짜는 필수 입력값 입니다.")
    LocalDate startDate,

    @Schema(description = "챌린지 마감날짜")
    @NotBlank(message = "챌린지 마감날짜는 필수 입력값 입니다.")
    LocalDate endDate,

    @Schema(description = "참여 가능 인원")
    @NotBlank(message = "참여 인원은 필수 입력값 입니다.")
    @Size(min = 1, max = 10, message = "최소 1명, 최대 10명까지만 가능합니다")
    Integer maxParticipants,

    @Schema(description = "공개 여부 (비공개 : false, 공개 : true)")
    @NotBlank(message = "공개 여부는 필수 입력값 입니다.")
    Boolean isPublic

) {

}
