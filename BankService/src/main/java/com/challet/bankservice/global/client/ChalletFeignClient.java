package com.challet.bankservice.global.client;

import com.challet.bankservice.domain.dto.response.PaymentHttpMessageResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "challet")
public interface ChalletFeignClient {

    @PostMapping("/api/challet/message/payments")
    void sendPaymentMessage(@RequestBody PaymentHttpMessageResponseDTO dto);
}