package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.MyRewadInfoResponseDTO;
import com.challet.challetservice.domain.dto.response.MyRewardListResponseDTO;
import com.challet.challetservice.domain.entity.QChallenge;
import com.challet.challetservice.domain.entity.QReward;
import com.challet.challetservice.domain.entity.Reward;
import com.challet.challetservice.domain.entity.User;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RewardRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public List<Reward> findMyRewards(Long userId) {
        QReward qReward = QReward.reward;
        QChallenge qChallenge = QChallenge.challenge;

        return queryFactory.selectFrom(qReward)
            .where(qReward.user.id.eq(userId))
            .orderBy(qReward.challenge.endDate.desc())
            .fetch();
    }

}
