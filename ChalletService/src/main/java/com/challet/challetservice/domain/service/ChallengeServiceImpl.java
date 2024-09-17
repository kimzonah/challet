package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ChallengeRegisterRequestDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.entity.UserChallenge;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import com.challet.challetservice.domain.repository.UserChallengeRepository;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import jakarta.transaction.Transactional;
import java.security.SecureRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChallengeServiceImpl implements ChallengeService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom random = new SecureRandom();
    private final ChallengeRepository challengeRepository;
    private final UserChallengeRepository userChallengeRepository;

    @Override
    @Transactional
    public void createChallenge(String header, ChallengeRegisterRequestDTO request) {
        String loginUser = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUser)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        // 비공개 챌린지라면 초대코드 생성
        String code = null;
        if(!request.isPublic()){
            code = generateCode(6);
        }

        // 챌린지 생성
        Challenge challenge = Challenge.createChallenge(request, code);
        challengeRepository.save(challenge);

        // 생성한 유저는 참여 멤버로 추가
        UserChallenge userChallenge = UserChallenge.addUserChallenge(user, challenge);
        userChallengeRepository.save(userChallenge);

    }

    public static String generateCode(int length){
        StringBuilder code = new StringBuilder(length);
        for(int i = 0; i < length; i++){
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }
}
