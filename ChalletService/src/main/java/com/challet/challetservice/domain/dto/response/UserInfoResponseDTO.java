package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "유저 정보 조회 응답 DTO")
public record UserInfoResponseDTO(

        @Schema(description = "프로필 사진 url")
        String profileImage,

        @Schema(description = "닉네임")
        String nickname

) {}
