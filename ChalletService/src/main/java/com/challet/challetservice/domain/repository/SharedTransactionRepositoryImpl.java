package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.ChallengeRoomHistoryResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.Emoji;
import com.challet.challetservice.domain.entity.EmojiType;
import com.challet.challetservice.domain.entity.QComment;
import com.challet.challetservice.domain.entity.QEmoji;
import com.challet.challetservice.domain.entity.QSharedTransaction;
import com.challet.challetservice.domain.entity.QUser;
import com.challet.challetservice.domain.entity.QUserChallenge;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class SharedTransactionRepositoryImpl implements SharedTransactionRepositoryCustom{
    
    private final JPAQueryFactory queryFactory;
    private final EmojiRepository emojiRepository;
    private final CommentRepository commentRepository;
    private static final int PAGE_SIZE = 7;

    @Override
    @Transactional(readOnly = true)
    public ChallengeRoomHistoryResponseDTO findByChallenge(Challenge challenge, User user, Long cursor) {
        QSharedTransaction qSharedTransaction = QSharedTransaction.sharedTransaction;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qSharedTransaction.userChallenge.challenge.eq(challenge));
        if (cursor != null) {
            builder.and(qSharedTransaction.id.lt(cursor));
        }

        List<SharedTransaction> sharedTransactions = queryFactory
            .selectFrom(qSharedTransaction)
            .where(builder)
            .orderBy(qSharedTransaction.id.desc())
            .limit(PAGE_SIZE+1)
            .fetch();

        boolean hasNextPage = sharedTransactions.size() > PAGE_SIZE;
        if (hasNextPage) {
            sharedTransactions.removeLast();
        }

        List<SharedTransactionDetailResponseDTO> history = sharedTransactions.stream()
            .map((sharedTransaction -> {
                Long goodCount = emojiRepository.countBySharedTransactionAndType(sharedTransaction, EmojiType.GOOD);
                Long sosoCount = emojiRepository.countBySharedTransactionAndType(sharedTransaction, EmojiType.SOSO);
                Long badCount = emojiRepository.countBySharedTransactionAndType(sharedTransaction, EmojiType.BAD);
                Long commentCount = commentRepository.countBySharedTransaction(sharedTransaction);
                EmojiType userEmoji = emojiRepository.findByUserAndSharedTransaction(user, sharedTransaction)
                    .map((Emoji::getType)).orElse(null);
                User sharedUser = findUserBySharedTransaction(sharedTransaction)
                    .orElseThrow(()-> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));
                return SharedTransactionDetailResponseDTO.fromHistory(sharedTransaction,sharedUser,goodCount,sosoCount,badCount,commentCount,userEmoji);
            }))
            .toList();



        return new ChallengeRoomHistoryResponseDTO(hasNextPage, history);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<User> findUserBySharedTransaction(SharedTransaction sharedTransaction) {

        QSharedTransaction qSharedTransaction = QSharedTransaction.sharedTransaction;
        QUserChallenge qUserChallenge = QUserChallenge.userChallenge;
        QUser qUser = QUser.user;

        return Optional.ofNullable(queryFactory
            .select(qUser)
            .from(qSharedTransaction)
            .join(qSharedTransaction.userChallenge, qUserChallenge)
            .join(qUserChallenge.user, qUser)
            .where(qSharedTransaction.eq(sharedTransaction))
            .fetchOne());
    }

}
