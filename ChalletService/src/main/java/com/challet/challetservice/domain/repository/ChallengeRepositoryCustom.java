package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.entity.Challenge;
import java.util.List;
import org.springframework.stereotype.Repository;

public interface ChallengeRepositoryCustom {

    List<Challenge> searchChallengeByKewordAndCategory(String keword, String category);

}
