package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "이모지 요청 DTO")
public record EmojiRequestDTO(

    @Schema(description = "유저가 선택한 이모지", allowableValues = {"1", "2", "3"})
    Integer score

) {

}
