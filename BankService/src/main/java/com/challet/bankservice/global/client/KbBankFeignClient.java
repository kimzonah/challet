package com.challet.bankservice.global.client;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "kb-bank")
public interface KbBankFeignClient {

    @PostMapping("/api/kb-bank/mydata-connect")
    AccountInfoResponseListDTO connectMyDataKbBank(
        @RequestHeader(value = "Authorization") String tokenHeader);

    @GetMapping("/api/kb-bank")
    AccountInfoResponseListDTO getMyDataKbBank(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader);
}
