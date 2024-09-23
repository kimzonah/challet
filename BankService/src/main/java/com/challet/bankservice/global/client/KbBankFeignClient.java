package com.challet.bankservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name= "kb-bank")
public interface KbBankFeignClient {

    @PostMapping("/api/kb-bank/mydata")
    void connectMyDataKbBank(@RequestHeader(value = "Authorization") String tokenHeader);
}
