package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.ChallengeRoomHistoryResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import java.util.Optional;

public interface SharedTransactionRepositoryCustom {

    ChallengeRoomHistoryResponseDTO findByChallenge(Challenge challenge, User user, Long cursor);

    Optional<User> findUserBySharedTransaction(SharedTransaction sharedTransaction);

    SharedTransactionDetailResponseDTO getDetail(SharedTransaction sharedTransaction, User user);

}
