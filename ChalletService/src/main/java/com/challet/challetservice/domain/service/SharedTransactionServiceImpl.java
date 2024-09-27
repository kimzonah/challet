package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ActionType;
import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.response.EmojiResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;
import com.challet.challetservice.domain.entity.Emoji;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import com.challet.challetservice.domain.repository.EmojiRepository;
import com.challet.challetservice.domain.repository.SharedTransactionRepository;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SharedTransactionServiceImpl implements SharedTransactionService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SharedTransactionRepository sharedTransactionRepository;
    private final EmojiRepository emojiRepository;

    @Override
    @Transactional
    public EmojiResponseDTO handleEmoji(String header,
        EmojiRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        SharedTransaction sharedTransaction = sharedTransactionRepository.findById(
                request.sharedTransactionId())
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_SHARED_TRANSACTION_EXCEPTION));

        EmojiResponseDTO response = null;

        if(request.action().equals(ActionType.ADD)){
            addEmoji(user, sharedTransaction, request);
            Long emojiCount = emojiRepository.countBySharedTransactionAndType(sharedTransaction, request.type());
            response = EmojiResponseDTO.fromRequest(request, emojiCount);
        }

        if(request.action().equals(ActionType.DELETE)){
            deleteEmoji(user, sharedTransaction);
            Long emojiCount = emojiRepository.countBySharedTransactionAndType(sharedTransaction, request.type());
            response = EmojiResponseDTO.fromRequest(request, emojiCount);
        }

        if (request.action().equals(ActionType.UPDATE)) {
            Emoji emoji = emojiRepository.findByUserAndSharedTransaction(user, sharedTransaction);
            emoji.updateEmoji(request.type());
            Long emojiCount = emojiRepository.countBySharedTransactionAndType(sharedTransaction, request.type());
            Long beforeEmojiCount = emojiRepository.countBySharedTransactionAndType(sharedTransaction, request.beforeType());
            response = EmojiResponseDTO.fromRequestWithBefore(request, emojiCount, beforeEmojiCount);
        }

        return response;
    }

    @Override
    public SharedTransactionDetailResponseDTO getDatail(String header, Long id) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        SharedTransaction sharedTransaction = sharedTransactionRepository.findById(id)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_SHARED_TRANSACTION_EXCEPTION));


        return null;
    }

    @Transactional
    public void addEmoji(User user, SharedTransaction sharedTransaction, EmojiRequestDTO request){
        Emoji emoji = Emoji.createEmoji(user, sharedTransaction, request.type());
        emojiRepository.save(emoji);
    }

    @Transactional
    public void deleteEmoji(User user, SharedTransaction sharedTransaction){
        Emoji emoji = emojiRepository.findByUserAndSharedTransaction(user, sharedTransaction);
        emojiRepository.delete(emoji);
    }
}
