package com.challet.shbankservice.domain.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sh-bank-service")
public class ShBankController {
    
    //개발 시 지우기
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to SH-Bank Service";
    }
}
