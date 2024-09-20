package com.challet.nhbankservicedemo.domain.repository;

import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.entity.QNhBank;
import com.challet.nhbankservicedemo.domain.entity.QNhBankTransaction;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class NhBankRepositoryImpl implements NhBankRepositoryCustom {

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO findByAccountInfo(String phoneNumber) {
        QNhBank bank = QNhBank.nhBank;
        List<AccountInfoResponseDTO> accountList = query.select(
                Projections.constructor(AccountInfoResponseDTO.class,
                    bank.id,
                    bank.accountNumber,
                    bank.accountBalance))
            .from(bank)
            .where(bank.phoneNumber.eq(phoneNumber)
                .and(bank.myDataStatus.isTrue()))
            .fetch();

        return AccountInfoResponseListDTO.
            builder()
            .accountCount(accountList.size())
            .accounts(accountList)
            .build();
    }

    @Override
    public List<TransactionResponseDTO> getTransactionByAccountInfo(Long accountId) {
        QNhBankTransaction bankTransaction = QNhBankTransaction.nhBankTransaction;
        QNhBank bank = QNhBank.nhBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                bankTransaction.id,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.transactionBalance,
                bankTransaction.transactionAmount))
            .from(bankTransaction)
            .join(bankTransaction.nhBank, bank)
            .where(bank.id.eq(accountId))
            .orderBy(bankTransaction.transactionDatetime.desc())
            .fetch();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionDetailById(Long transactionId) {
        QNhBankTransaction bankTransaction = QNhBankTransaction.nhBankTransaction;

        return query
            .select(Projections.constructor(TransactionDetailResponseDTO.class,
                bankTransaction.transactionAmount,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.withdrawal,
                bankTransaction.transactionBalance,
                bankTransaction.category))
            .from(bankTransaction)
            .where(bankTransaction.id.eq(transactionId))
            .fetchOne();
    }


    @Override
    public Long findAccountBalanceById(Long accountId) {
        QNhBank bank = QNhBank.nhBank;

        return query
            .select(bank.accountBalance)
            .from(bank)
            .where(bank.id.eq(accountId))
            .fetchOne();
    }
}