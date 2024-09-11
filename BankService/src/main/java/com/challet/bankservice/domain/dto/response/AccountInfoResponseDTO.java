package com.challet.bankservice.domain.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountInfoResponseDTO {
    private Long id;
    private String accountNumber;
    private String accountBalance;
}
