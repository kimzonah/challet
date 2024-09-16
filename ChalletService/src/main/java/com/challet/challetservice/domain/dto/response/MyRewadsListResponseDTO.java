package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "내 리워드 조회 응답 DTO")
public record MyRewadsListResponseDTO(

    @Schema(description = "리워드ID")
    Long rewardId,

    @Schema(description = "리워드 종류 (실패 : 0, 성공 : 1)")
    Boolean type

) {

}
