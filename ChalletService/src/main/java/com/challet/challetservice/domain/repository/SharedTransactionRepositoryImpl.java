package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.ChallengeRoomHistoryResponseDTO;
import com.challet.challetservice.domain.dto.response.EmojiReactionDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionInfoDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.Emoji;
import com.challet.challetservice.domain.entity.EmojiType;
import com.challet.challetservice.domain.entity.QComment;
import com.challet.challetservice.domain.entity.QSharedTransaction;
import com.challet.challetservice.domain.entity.QUser;
import com.challet.challetservice.domain.entity.QUserChallenge;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
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
    private static final int ITEM_SIZE = 7;
    private final EmojiRepositoryImpl emojiRepositoryImpl;

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
            .limit(ITEM_SIZE +1)
            .fetch();

        boolean hasNextPage = sharedTransactions.size() > ITEM_SIZE;
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

    @Override
    @Transactional(readOnly = true)
    public SharedTransactionDetailResponseDTO getDetail(SharedTransaction sharedTransaction, User user) {
        QSharedTransaction qSharedTransaction = QSharedTransaction.sharedTransaction;
        QUserChallenge qUserChallenge = QUserChallenge.userChallenge;
        QUser qUser = QUser.user;
        QComment qComment = QComment.comment;

        EmojiReactionDTO emojiReaction = emojiRepositoryImpl.getEmojiReaction(sharedTransaction, user);


        SharedTransactionInfoDTO info = queryFactory
            .select(Projections.constructor(
                SharedTransactionInfoDTO.class,
                qUser.id.as("userId"),
                qUser.nickname.as("nickname"),
                qUser.profileImage.as("profileImage"),
                qSharedTransaction.id.as("sharedTransactionId"),
                qSharedTransaction.withdrawal.as("withdrawal"),
                qSharedTransaction.transactionAmount.as("transactionAmount"),
                qSharedTransaction.transactionDateTime.as("transactionDateTime"),
                qSharedTransaction.content.as("content"),
                qSharedTransaction.image.as("image"),
                qComment.count().as("commentCount")
            ))
            .from(qSharedTransaction)
            .join(qUserChallenge).on(qSharedTransaction.userChallenge.eq(qUserChallenge))
            .join(qUser).on(qUserChallenge.user.eq(qUser))
            .leftJoin(qComment).on(qComment.sharedTransaction.eq(qSharedTransaction))
            .where(qSharedTransaction.eq(sharedTransaction))
            .fetchOne();

        return SharedTransactionDetailResponseDTO.fromInfoAndReaction(info, emojiReaction);
    }



}
