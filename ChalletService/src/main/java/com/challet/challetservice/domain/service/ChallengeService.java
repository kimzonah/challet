package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ChallengeRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.ChallengeDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeListResponseDTO;

public interface ChallengeService {

    void createChallenge(String header, ChallengeRegisterRequestDTO request);

    ChallengeListResponseDTO getMyChallenges(String header);

    ChallengeListResponseDTO searchChallenges(String header, String keyword, String category);

    ChallengeDetailResponseDTO getChallengeDetail(String header, Long id);
}
