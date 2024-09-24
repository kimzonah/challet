package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.response.EmojiResponseDTO;

public interface SharedTransactionService {

    EmojiResponseDTO handleEmoji(String header, EmojiRequestDTO request);
}
