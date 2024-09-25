package com.challet.challetservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ch-bank")
public interface ChBankFeignClient {

    @PostMapping("/api/ch-bank")
    void requestCreateChBankAccount(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader);
}
