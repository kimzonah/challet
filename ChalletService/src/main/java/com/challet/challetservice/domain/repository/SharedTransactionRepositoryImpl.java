package com.challet.challetservice.domain.repository;

import com.challet.challetservice.domain.dto.response.ChallengeRoomHistoryResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.Emoji;
import com.challet.challetservice.domain.entity.EmojiType;
import com.challet.challetservice.domain.entity.QSharedTransaction;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class SharedTransactionRepositoryImpl implements SharedTransactionRepositoryCustom{
    
    private final JPAQueryFactory queryFactory;
    private final EmojiRepository emojiRepository;
    private final CommentRepository commentRepository;

    @Override
    @Transactional
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
            .limit(6)
            .fetch();

        boolean hasNextPage = sharedTransactions.size() > 5;
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
                return SharedTransactionDetailResponseDTO.fromHistoru(sharedTransaction,goodCount,sosoCount,badCount,commentCount,userEmoji);
            }))
            .toList();



        return new ChallengeRoomHistoryResponseDTO(hasNextPage, history);
    }

}
