package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.request.PaymentHttpMessageRequestDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/challet/message")
@Tag(name = "ChallengeMessageController", description = "ch-bank에서 결제 시 메시지 받는 controller")
public class ChallengeMessageController {

    private static final Logger log = LoggerFactory.getLogger(ChallengeMessageController.class);
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/payments")
    public ResponseEntity<?> getPaymentMessage(@RequestBody PaymentHttpMessageRequestDTO paymentNotification) {

        // 결제 정보를 WebSocket으로 전송
        //messagingTemplate.convertAndSend("/topic/challenges/" + id + "/shared-transactions", paymentNotification);
        log.info("paymentNotification: {}", paymentNotification);
        return ResponseEntity.ok().build();
    }
}