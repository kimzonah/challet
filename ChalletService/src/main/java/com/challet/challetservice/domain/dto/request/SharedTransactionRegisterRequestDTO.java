package com.challet.challetservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "공유 거래 내역 수동 등록 요청 DTO")
public class SharedTransactionRegisterRequestDTO {

    @Schema(description = "출금처")
    private String withdrawal;

    @Schema(description = "거래 금액")
    private Long transactionAmount;

    @Schema(description = "거래일시")
    private LocalDateTime transactionDateTime;

    @Schema(description = "내용")
    private String content;

    @Schema(description = "이미지")
    private String image;

}
