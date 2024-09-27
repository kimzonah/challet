package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ChallengeJoinRequestDTO;
import com.challet.challetservice.domain.dto.request.ChallengeRegisterRequestDTO;
import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.ChallengeDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeListResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeRoomHistoryResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionRegisterResponseDTO;
import com.challet.challetservice.domain.dto.response.SpendingAmountResponseDTO;
import org.springframework.data.domain.Pageable;

public interface ChallengeService {

    void createChallenge(String header, ChallengeRegisterRequestDTO request);

    ChallengeListResponseDTO getMyChallenges(String header);

    ChallengeListResponseDTO searchChallenges(String header, String keyword, String category);

    ChallengeDetailResponseDTO getChallengeDetail(String header, Long id);

    void joinChallenge(String header, Long id, ChallengeJoinRequestDTO request);

    SharedTransactionRegisterResponseDTO handleSharedTransaction(String header, Long id, SharedTransactionRegisterRequestDTO request);

    ChallengeRoomHistoryResponseDTO getChallengeRoomHistory(String header, Long id, Long cursor);

    SpendingAmountResponseDTO getSpendingAmount(String header, Long id);
}
