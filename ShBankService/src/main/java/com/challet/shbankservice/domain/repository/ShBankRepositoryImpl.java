package com.challet.shbankservice.domain.repository;

import com.challet.shbankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.shbankservice.domain.entity.QShBank;
import com.challet.shbankservice.domain.entity.QShBankTransaction;
import com.challet.shbankservice.domain.entity.ShBank;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ShBankRepositoryImpl implements ShBankRepositoryCustom {

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber) {
        QShBank bank = QShBank.shBank;
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
    public List<TransactionResponseDTO> getTransactionByAccountId(Long accountId) {
        QShBankTransaction bankTransaction = QShBankTransaction.shBankTransaction;
        QShBank bank = QShBank.shBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                bankTransaction.id,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.transactionBalance,
                bankTransaction.transactionAmount))
            .from(bankTransaction)
            .join(bankTransaction.shBank, bank)
            .where(bank.id.eq(accountId))
            .orderBy(bankTransaction.transactionDatetime.desc())
            .fetch();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionDetailById(Long transactionId) {
        QShBankTransaction bankTransaction = QShBankTransaction.shBankTransaction;

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
    public Long getAccountBalanceById(Long accountId) {
        QShBank bank = QShBank.shBank;

        return query
            .select(bank.accountBalance)
            .from(bank)
            .where(bank.id.eq(accountId))
            .fetchOne();
    }

    @Override
    public void connectMyDataAccount(String phoneNumber) {
        QShBank shBank = QShBank.shBank;
        query
            .update(shBank)
            .set(shBank.myDataStatus, true)
            .where(shBank.phoneNumber.eq(phoneNumber))
            .execute();
    }

    @Override
    public ShBank findByAccountNumber(String accountNumber) {
        QShBank shBank = QShBank.shBank;
        return query
            .selectFrom(shBank)
            .where(shBank.accountNumber.eq(accountNumber))
            .fetchOne();
    }
}
