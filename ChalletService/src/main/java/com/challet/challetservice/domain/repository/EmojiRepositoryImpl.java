package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.EmojiReactionDTO;
import com.challet.challetservice.domain.entity.EmojiType;
import com.challet.challetservice.domain.entity.QEmoji;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class EmojiRepositoryImpl implements EmojiRepositoryCustom{

    private final JPAQueryFactory queryFactory;


    @Override
    @Transactional(readOnly = true)
    public EmojiReactionDTO getEmojiReaction(SharedTransaction sharedTransaction, User user) {
        QEmoji qEmoji = QEmoji.emoji;

        return queryFactory
            .select(Projections.constructor(
                EmojiReactionDTO.class,
                new CaseBuilder()
                    .when(qEmoji.type.eq(EmojiType.GOOD)).then(1L).otherwise(0L).sum().coalesce(0L),
                new CaseBuilder()
                    .when(qEmoji.type.eq(EmojiType.SOSO)).then(1L).otherwise(0L).sum().coalesce(0L),
                new CaseBuilder()
                    .when(qEmoji.type.eq(EmojiType.BAD)).then(1L).otherwise(0L).sum().coalesce(0L),
                queryFactory.select(qEmoji.type)
                    .from(qEmoji)
                    .where(qEmoji.sharedTransaction.eq(sharedTransaction)
                        .and(qEmoji.user.eq(user)))
                    .limit(1)
            ))
            .from(qEmoji)
            .where(qEmoji.sharedTransaction.eq(sharedTransaction))
            .fetchOne();

    }
}
