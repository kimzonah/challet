package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.response.EmojiResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;

public interface SharedTransactionService {

    EmojiResponseDTO handleEmoji(String header, EmojiRequestDTO request);

    SharedTransactionDetailResponseDTO getDatail(String header, Long id);
}
