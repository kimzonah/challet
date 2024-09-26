package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ActionType;
import com.challet.challetservice.domain.dto.request.ChallengeJoinRequestDTO;
import com.challet.challetservice.domain.dto.request.ChallengeRegisterRequestDTO;
import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.ChallengeDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeInfoResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeListResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionRegisterResponseDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.ChallengeStatus;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.entity.UserChallenge;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import com.challet.challetservice.domain.repository.ChallengeRepositorySupport;
import com.challet.challetservice.domain.repository.SharedTransactionRepository;
import com.challet.challetservice.domain.repository.UserChallengeRepository;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import jakarta.transaction.Transactional;
import java.security.SecureRandom;
import java.util.List;
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
    private final ChallengeRepositorySupport challengeRepositorySupport;
    private final SharedTransactionRepository sharedTransactionRepository;

    @Override
    @Transactional
    public void createChallenge(String header, ChallengeRegisterRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        // 비공개 챌린지라면 초대코드 생성
        String code = null;
        if (!request.isPublic()) {
            code = generateCode(6);
        }

        // 챌린지 생성
        Challenge challenge = Challenge.createChallenge(request, code);
        challengeRepository.save(challenge);

        // 생성한 유저는 참여 멤버로 추가
        UserChallenge userChallenge = UserChallenge.addUserChallenge(user, challenge);
        userChallengeRepository.save(userChallenge);

    }

    @Override
    @Transactional
    public ChallengeListResponseDTO getMyChallenges(String header) {

        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        if (user.getUserChallenges() == null || user.getUserChallenges().isEmpty()) {
            return null;
        }

        List<ChallengeInfoResponseDTO> result = user.getUserChallenges().stream()
            .map(userChallenge -> {
                Challenge challenge = userChallenge.getChallenge();
                return ChallengeInfoResponseDTO.fromChallenge(challenge,
                    challenge.getUserChallenges().size());
            })
            .toList();

        return new ChallengeListResponseDTO(result);
    }

    @Override
    @Transactional
    public ChallengeListResponseDTO searchChallenges(String header, String keyword,
        String category) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        List<Challenge> searchChallengesList = challengeRepositorySupport.searchChallengeByKewordAndCategory(
            keyword, category);
        if (searchChallengesList == null || searchChallengesList.isEmpty()) {
            return null;
        }
        List<ChallengeInfoResponseDTO> result = searchChallengesList.stream()
            .map(challenge -> ChallengeInfoResponseDTO.fromChallenge(challenge,
                challenge.getUserChallenges().size()))
            .toList();

        return new ChallengeListResponseDTO(result);
    }

    @Override
    @Transactional
    public ChallengeDetailResponseDTO getChallengeDetail(String header, Long id) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        Challenge challenge = challengeRepository.findById(id)
            .orElseThrow(
                () -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

        return ChallengeDetailResponseDTO.of(challenge,
            userChallengeRepository.existsByChallengeAndUser(challenge, user),
            challenge.getUserChallenges().size());
    }

    @Override
    @Transactional
    public void joinChallenge(String header, Long id, ChallengeJoinRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        Challenge challenge = challengeRepository.findById(id)
            .orElseThrow(
                () -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

        // 비공개 챌린지라면 코드 검증
        if (!request.isPublic() && !request.inviteCode().equals(challenge.getInviteCode())) {
            throw new ExceptionResponse(CustomException.CODE_MISMATCH_EXCEPTION);
        }

        // 이미 참여중인 챌린지라면 예외처리
        if (userChallengeRepository.existsByChallengeAndUser(challenge, user)) {
            throw new ExceptionResponse(CustomException.ALREADY_JOIN_EXCEPTION);
        }

        // 모집중인 챌린지가 아니라면 참여 불가
        if (!challenge.getStatus().equals(ChallengeStatus.RECRUITING)) {
            throw new ExceptionResponse(CustomException.NOT_RECRUITING_EXCEPTION);
        }

        // 참여인원 초과면 참여 불가
        if(challenge.getUserChallenges().size() >= challenge.getMaxParticipants()){
            throw new ExceptionResponse(CustomException.MAX_PARTICIPANTS_EXCEEDED_EXCEPTION);
        }


        UserChallenge userChallenge = UserChallenge.addUserChallenge(user, challenge);
        userChallengeRepository.save(userChallenge);

    }

    @Override
    public SharedTransactionRegisterResponseDTO handleSharedTransaction(String header, Long id, SharedTransactionRegisterRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        Challenge challenge = challengeRepository.findById(id)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

        // 챌린지 참여자가 아니라면
        if(!userChallengeRepository.existsByChallengeAndUser(challenge, user)){
            throw new ExceptionResponse(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        // action이 ADD일때
        if (request.action().equals(ActionType.ADD)){

            UserChallenge userChallenge = userChallengeRepository.findByChallengeAndUser(challenge, user);
            SharedTransaction savedSharedTransaction = sharedTransactionRepository.save(SharedTransaction.fromRequest(request, userChallenge));

            return SharedTransactionRegisterResponseDTO.from(savedSharedTransaction, user);
        }
        
        return null;
    }

    public static String generateCode(int length) {
        StringBuilder code = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }
}
