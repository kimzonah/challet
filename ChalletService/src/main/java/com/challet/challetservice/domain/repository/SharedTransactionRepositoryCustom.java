package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.ChallengeRoomHistoryResponseDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface SharedTransactionRepositoryCustom {

    ChallengeRoomHistoryResponseDTO findByChallenge(Challenge challenge, User user, Long cursor);

}
