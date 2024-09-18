package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.bankservice.domain.entity.QChalletBank;
import com.challet.bankservice.domain.entity.QChalletBankTransaction;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ChalletBankRepositoryImpl implements ChalletBankRepositoryCustom {

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO findByAccountInfo(String phoneNumber) {
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

        return new AccountInfoResponseListDTO(accountList.size(), accountList);
    }

    @Override
    public List<TransactionResponseDTO> getTransactionByAccountInfo(Long accountId) {
        QChalletBankTransaction challetBankTransaction = QChalletBankTransaction.challetBankTransaction;
        QChalletBank challetBank = QChalletBank.challetBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                challetBankTransaction.id,
                challetBankTransaction.transactionDatetime,
                challetBankTransaction.withdrawal,
                challetBankTransaction.transactionBalance,
                challetBankTransaction.transactionAmount))
            .from(challetBankTransaction)
            .join(challetBankTransaction.challetBank, challetBank)
            .where(challetBank.id.eq(accountId))
            .orderBy(challetBankTransaction.transactionDatetime.desc())
            .fetch();
    }
}