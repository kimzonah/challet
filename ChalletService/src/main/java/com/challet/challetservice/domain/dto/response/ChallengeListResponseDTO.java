package com.challet.challetservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "챌린지 리스트 응답 DTO")
public record ChallengeListResponseDTO(

    @Schema(description = "챌린지 리스트")
    List<ChallengeInfoResponseDTO> challengeList

) {

}
