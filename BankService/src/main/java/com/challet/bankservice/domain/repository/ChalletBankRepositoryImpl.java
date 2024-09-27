package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.bankservice.domain.entity.ChalletBank;
import com.challet.bankservice.domain.entity.QChalletBank;
import com.challet.bankservice.domain.entity.QChalletBankTransaction;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.LockModeType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class ChalletBankRepositoryImpl implements ChalletBankRepositoryCustom {

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber) {
        QChalletBank challetBank = QChalletBank.challetBank;

        List<AccountInfoResponseDTO> accountList = query
            .select(Projections.constructor(AccountInfoResponseDTO.class,
                challetBank.id,
                challetBank.accountNumber,
                challetBank.accountBalance
            ))
            .from(challetBank)
            .where(challetBank.phoneNumber.eq(phoneNumber))
            .fetch();

        return AccountInfoResponseListDTO
            .builder()
            .accountCount(accountList.size())
            .accounts(accountList)
            .build();
    }

    @Override
    public List<TransactionResponseDTO> getTransactionByAccountId(Long accountId) {
        QChalletBankTransaction challetBankTransaction = QChalletBankTransaction.challetBankTransaction;
        QChalletBank challetBank = QChalletBank.challetBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                challetBankTransaction.id,
                challetBankTransaction.transactionDatetime,
                challetBankTransaction.deposit,
                challetBankTransaction.transactionBalance,
                challetBankTransaction.transactionAmount))
            .from(challetBankTransaction)
            .join(challetBankTransaction.challetBank, challetBank)
            .where(challetBank.id.eq(accountId))
            .orderBy(challetBankTransaction.transactionDatetime.desc())
            .fetch();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionDetailById(Long transactionId) {
        QChalletBankTransaction challetBankTransaction = QChalletBankTransaction.challetBankTransaction;

        return query
            .select(Projections.constructor(TransactionDetailResponseDTO.class,
                challetBankTransaction.transactionAmount,
                challetBankTransaction.transactionDatetime,
                challetBankTransaction.deposit,
                challetBankTransaction.withdrawal,
                challetBankTransaction.transactionBalance,
                challetBankTransaction.category))
            .from(challetBankTransaction)
            .where(challetBankTransaction.id.eq(transactionId))
            .fetchOne();
    }


    @Override
    public Long findAccountBalanceById(Long accountId) {
        QChalletBank challetBank = QChalletBank.challetBank;

        return query
            .select(challetBank.accountBalance)
            .from(challetBank)
            .where(challetBank.id.eq(accountId))
            .fetchOne();
    }

    @Override
    public ChalletBank findByIdWithLock(Long accountId) {
        QChalletBank challetBank = QChalletBank.challetBank;

        return query
            .selectFrom(challetBank)
            .where(challetBank.id.eq(accountId))
            .setLockMode(LockModeType.PESSIMISTIC_WRITE)
            .fetchOne();
    }

    @Transactional
    @Override
    public void setMyDataAuthorization(String phoneNumber) {
        QChalletBank challetBank = QChalletBank.challetBank;

        query
            .update(challetBank)
            .set(challetBank.myDataStatus, true)
            .where(challetBank.phoneNumber.eq(phoneNumber))
            .execute();
    }

    @Override
    public ChalletBank getAccountByAccountNumber(String accountNumber) {
        QChalletBank challetBank = QChalletBank.challetBank;

        return query
            .selectFrom(challetBank)
            .where(challetBank.accountNumber.eq(accountNumber))
            .fetchOne();
    }
}