package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "리워드 상세 조회 응답 DTO")
public record RewardDetailResponseDTO(

        @Schema(description = "챌린지 제목")
        String title,

        @Schema(description = "챌린지 카테고리")
        String category,

        @Schema(description = "챌린지 소비한도")
        Long spendingLimit,

        @Schema(description = "챌린지 시작날짜")
        LocalDate startDate,

        @Schema(description = "챌린지 마감날짜")
        LocalDate endDate,

        @Schema(description = "실제 소비금액")
        Long spendingAmount,

        @Schema(description = "리워드 종류(실패 : 0, 성공 : 1)")
        Boolean type

) {}
