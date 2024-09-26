package com.challet.kbbankservice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;


@Builder
@Schema(description = "계좌 이체시 응답 DTO")
public record AccountTransferResponseDTO (

    @Schema(description = "계좌 사용자 전화번호")
    String phoneNumber,

    @Schema(description = "계좌 번호")
    String accountNumber
){

}
