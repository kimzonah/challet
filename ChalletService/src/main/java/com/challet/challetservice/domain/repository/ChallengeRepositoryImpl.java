package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.entity.Category;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.ChallengeStatus;
import com.challet.challetservice.domain.entity.QChallenge;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ChallengeRepositoryImpl implements ChallengeRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Challenge> searchChallengeByKewordAndCategory(String keword, String category) {
        QChallenge qChallenge = QChallenge.challenge;
        BooleanBuilder builder = new BooleanBuilder();

        // keyword가 있으면 조건 적용
        if (keword != null && !keword.isEmpty()) {
            builder.and(qChallenge.title.containsIgnoreCase(keword));
        }

        // category가 있으면 조건 적용
        if (category != null && !category.isEmpty()) {
            builder.and(qChallenge.category.eq(Category.valueOf(category)));
        }

        // 모집중인 챌린지만 조회
        builder.and(qChallenge.status.eq(ChallengeStatus.RECRUITING));

        return queryFactory.selectFrom(qChallenge).where(builder).fetch();
    }

}
