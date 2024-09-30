package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.entity.Challenge;
import java.util.List;

public interface ChallengeRepositoryCustom {

    List<Challenge> searchChallengeByKeywordAndCategory(String keyword, String category);

}
