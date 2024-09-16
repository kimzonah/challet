package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원가입 요청 DTO")
public record UserRegisterRequestDTO(

        @Schema(description = "전화번호")
        String phoneNumber,

        @Schema(description = "간편비밀번호, 6자리만 입력가능")
        String password,

        @Schema(description = "닉네임")
        String nickname,

        @Schema(description = "프로필 사진")
        String profileImage,

        @Schema(description = "나이")
        int age,

        @Schema(description = "성별")
        int gender,

        @Schema(description = "이름")
        String name

) {}
