package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ChallengeRegisterRequestDTO;

public interface ChallengeService {

    void createChallenge(String header, ChallengeRegisterRequestDTO request);
}
