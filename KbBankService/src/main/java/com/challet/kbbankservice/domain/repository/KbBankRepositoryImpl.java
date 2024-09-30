package com.challet.kbbankservice.domain.repository;

import com.challet.kbbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.kbbankservice.domain.entity.KbBank;
import com.challet.kbbankservice.domain.entity.QKbBank;
import com.challet.kbbankservice.domain.entity.QKbBankTransaction;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class KbBankRepositoryImpl implements KbBankRepositoryCustom {

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber) {
        QKbBank bank = QKbBank.kbBank;
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
        QKbBankTransaction bankTransaction = QKbBankTransaction.kbBankTransaction;
        QKbBank bank = QKbBank.kbBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                bankTransaction.id,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.transactionBalance,
                bankTransaction.transactionAmount))
            .from(bankTransaction)
            .join(bankTransaction.kbBank, bank)
            .where(bank.id.eq(accountId))
            .orderBy(bankTransaction.transactionDatetime.desc())
            .fetch();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionDetailById(Long transactionId) {
        QKbBankTransaction bankTransaction = QKbBankTransaction.kbBankTransaction;

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
        QKbBank bank = QKbBank.kbBank;

        return query
            .select(bank.accountBalance)
            .from(bank)
            .where(bank.id.eq(accountId))
            .fetchOne();
    }

    @Override
    public void connectMyDataAccount(String phoneNumber) {
        QKbBank bank = QKbBank.kbBank;
        query
            .update(bank)
            .set(bank.myDataStatus, true)
            .where(bank.phoneNumber.eq(phoneNumber))
            .execute();
    }

    @Override
    public Optional<KbBank> findByAccountNumber(String accountNumber) {
        QKbBank kbBank = QKbBank.kbBank;
        KbBank result = query
            .selectFrom(kbBank)
            .where(kbBank.accountNumber.eq(accountNumber))
            .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(
        String phoneNumber, MonthlyTransactionRequestDTO requestDTO) {
        QKbBankTransaction kbBankTransaction = QKbBankTransaction.kbBankTransaction;
        QKbBank kbBank = QKbBank.kbBank;

        List<MonthlyTransactionHistoryDTO> result = query
            .select(Projections.constructor(MonthlyTransactionHistoryDTO.class,
                Expressions.constant("kb-bank"),
                kbBank.accountNumber,
                kbBank.accountBalance,
                kbBankTransaction.transactionDatetime,
                kbBankTransaction.deposit,
                kbBankTransaction.withdrawal,
                kbBankTransaction.transactionBalance,
                kbBankTransaction.transactionAmount,
                kbBankTransaction.category))
            .from(kbBankTransaction)
            .join(kbBankTransaction.kbBank, kbBank)
            .where(kbBank.phoneNumber.eq(phoneNumber)
                .and(kbBank.myDataStatus.isTrue())
                .and(kbBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                .and(kbBankTransaction.transactionDatetime.month().eq(requestDTO.month())))
            .orderBy(kbBankTransaction.transactionDatetime.desc())
            .fetch();

        return MonthlyTransactionHistoryListDTO.from(result);
    }
}
