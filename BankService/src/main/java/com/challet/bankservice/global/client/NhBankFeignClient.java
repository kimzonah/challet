package com.challet.bankservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name= "nh-bank")
public interface NhBankFeignClient {

    @PostMapping("/api/nh-bank/mydata")
    void connectMyDataKbBank(@RequestHeader(value = "Authorization") String tokenHeader);
}
