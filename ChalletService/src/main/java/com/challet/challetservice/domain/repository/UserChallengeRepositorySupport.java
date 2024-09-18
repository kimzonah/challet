package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.ChallengeInfoResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeListResponseDTO;
import com.challet.challetservice.domain.entity.QChallenge;
import com.challet.challetservice.domain.entity.QUserChallenge;
import com.challet.challetservice.domain.entity.User;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserChallengeRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public ChallengeListResponseDTO findChallengesByUserId(Long userId){
        QUserChallenge userChallenge = QUserChallenge.userChallenge;
        QChallenge challenge = QChallenge.challenge;

        List<ChallengeInfoResponseDTO> challengeList = queryFactory
            .select(Projections.constructor(
                ChallengeInfoResponseDTO.class,
                challenge.id,
                challenge.status.stringValue(),
                challenge.category.stringValue(),
                challenge.title,
                challenge.spendingLimit,
                challenge.startDate,
                challenge.endDate,
                challenge.maxParticipants,
                userChallenge.count().intValue().as("currentParticipants"),
                challenge.inviteCode.isNull().as("isPublic")
            ))
            .from(userChallenge)
            .join(userChallenge.challenge, challenge)
            .where(userChallenge.user.id.eq(userId))
            .groupBy(challenge.id)
            .fetch();

        return new ChallengeListResponseDTO(challengeList);
    }

}
