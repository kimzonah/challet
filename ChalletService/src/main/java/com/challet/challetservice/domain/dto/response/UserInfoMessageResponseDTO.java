package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;

@Builder
@Schema(description = "유저 중 나이, 성별이 같은 응답 DTO")
public record UserInfoMessageResponseDTO (

    @Schema(description = "전화번호 목록")
    List<String> phoneNumbers
){
    public static UserInfoMessageResponseDTO from(List<String> phoneNumbers) {
        return UserInfoMessageResponseDTO
            .builder()
            .phoneNumbers(phoneNumbers)
            .build();
    }
}
