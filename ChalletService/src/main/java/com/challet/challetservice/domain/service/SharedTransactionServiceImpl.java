package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ActionType;
import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.response.EmojiResponseDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import com.challet.challetservice.domain.repository.SharedTransactionRepository;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SharedTransactionServiceImpl implements SharedTransactionService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SharedTransactionRepository sharedTransactionRepository;

    @Override
    public EmojiResponseDTO handleEmoji(String header, Long id,
        EmojiRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        // 이모지 등록이면
        if(request.action().equals(ActionType.ADD)){

        }
        else if(request.action().equals(ActionType.DELETE)){

        }
        else {

        }

        return null;
    }

//    public static addEmoji(User user, )
}
