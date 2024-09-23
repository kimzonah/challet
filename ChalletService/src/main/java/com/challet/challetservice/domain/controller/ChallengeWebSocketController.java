package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionRegisterResponseDTO;
import com.challet.challetservice.domain.service.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Tag(name = "ChallengeWebSocketController", description = "챌린지 관련 웹소켓 요청")
public class ChallengeWebSocketController {

    private final ChallengeService challengeService;

    @Operation(summary = "챌린지에 공유 거래 내역 등록", description = ""
        + "연결 경로 : /ws"
        + "메시지 전송 경로 : /app/challenges/{id}/shared-transactions"
        + "메시지 구독 경로 : /topic/challenges/{id}/shared-transactions")
    @MessageMapping("/challenges/{id}/shared-transactions")
    @SendTo("/topic/challenges/{id}/shared-transactions")
    public SharedTransactionRegisterResponseDTO registerTransaction(StompHeaderAccessor headerAccessor, @DestinationVariable Long id, SharedTransactionRegisterRequestDTO request) {
        return challengeService.registerTransaction(headerAccessor.getFirstNativeHeader("Authorization"),id, request);
    }
}
