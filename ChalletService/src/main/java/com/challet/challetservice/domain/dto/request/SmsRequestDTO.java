package com.challet.challetservice.domain.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SmsRequestDTO(

    @NotBlank
    String phoneNumber

) {

}
