package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "welcome 요청 DTO")
public class WelcomeRequest {

    @Schema(description = "요청 보낼 메세지")
    private String message;

}
