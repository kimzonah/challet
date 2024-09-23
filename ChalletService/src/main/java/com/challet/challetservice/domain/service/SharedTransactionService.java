package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.response.EmojiResponseDTO;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

public interface SharedTransactionService {

    EmojiResponseDTO handleEmoji(String header, Long id,
        EmojiRequestDTO request);
}
