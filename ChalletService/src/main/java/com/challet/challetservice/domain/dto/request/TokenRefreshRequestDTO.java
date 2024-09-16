package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "토큰 재발급 요청 DTO")
public record TokenRefreshRequestDTO(

    @Schema(description = "리프레시 토큰")
    String refreshToken

) {

}
