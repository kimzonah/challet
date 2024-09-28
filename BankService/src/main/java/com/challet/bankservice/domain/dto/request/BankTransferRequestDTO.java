package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(name = "타은행간의 계좌 이체 응답DTO")
public record BankTransferRequestDTO(

    @Schema(description = "이체 받은 사용자 이름")
    String name
) {
}
