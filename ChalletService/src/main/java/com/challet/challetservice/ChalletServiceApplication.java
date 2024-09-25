package com.challet.challetservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ChalletServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChalletServiceApplication.class, args);
    }

}
