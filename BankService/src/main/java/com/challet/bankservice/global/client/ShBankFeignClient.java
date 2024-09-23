package com.challet.bankservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name= "Sh-bank")
public interface ShBankFeignClient {

    @PostMapping("/api/sh-bank/mydata")
    void connectMyDataKbBank(@RequestHeader(value = "Authorization") String tokenHeader);
}
