package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.request.UserInfoMessageRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.bankservice.domain.entity.Category;
import com.challet.bankservice.domain.entity.ChalletBank;
import com.challet.bankservice.domain.entity.QChalletBank;
import com.challet.bankservice.domain.entity.QChalletBankTransaction;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.LockModeType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class ChalletBankRepositoryImpl implements ChalletBankRepositoryCustom {

    private static final int BATCH_SIZE = 1000;

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
    public boolean isMyDataConnectedByPhoneNumber(String phoneNumber) {
        QChalletBank challetBank = QChalletBank.challetBank;

        Boolean myDataStatus = query
            .select(challetBank.myDataStatus)
            .from(challetBank)
            .where(challetBank.phoneNumber.eq(phoneNumber))
            .fetchFirst();

        return Boolean.TRUE.equals(myDataStatus);
    }

    @Override
    public ChalletBank getAccountByAccountNumber(String accountNumber) {
        QChalletBank challetBank = QChalletBank.challetBank;

        return query
            .selectFrom(challetBank)
            .where(challetBank.accountNumber.eq(accountNumber))
            .fetchOne();
    }

    @Override
    public MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(
        String phoneNumber, MonthlyTransactionRequestDTO requestDTO) {
        QChalletBankTransaction challetBankTransaction = QChalletBankTransaction.challetBankTransaction;
        QChalletBank challetBank = QChalletBank.challetBank;

        List<MonthlyTransactionHistoryDTO> result = query
            .select(Projections.constructor(MonthlyTransactionHistoryDTO.class,
                Expressions.constant("ch-bank"),
                challetBank.accountNumber,
                challetBank.accountBalance,
                challetBankTransaction.transactionDatetime,
                challetBankTransaction.deposit,
                challetBankTransaction.withdrawal,
                challetBankTransaction.transactionBalance,
                challetBankTransaction.transactionAmount,
                challetBankTransaction.category))
            .from(challetBankTransaction)
            .join(challetBankTransaction.challetBank, challetBank)
            .where(challetBank.phoneNumber.eq(phoneNumber)
                .and(challetBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                .and(challetBankTransaction.transactionDatetime.month().eq(requestDTO.month())))
            .orderBy(challetBankTransaction.transactionDatetime.desc())
            .fetch();

        return MonthlyTransactionHistoryListDTO.from(result);
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        UserInfoMessageRequestDTO analysisInfo, MonthlyTransactionRequestDTO requestDTO) {
        QChalletBankTransaction challetBankTransaction = QChalletBankTransaction.challetBankTransaction;
        QChalletBank challetBank = QChalletBank.challetBank;

        List<String> phoneNumbers = analysisInfo.phoneNumbers();
        Map<Category, Long> categorySums = new HashMap<>();

        for (int i = 0; i < phoneNumbers.size(); i += BATCH_SIZE) {
            List<String> subListPhoneNumbers = subList(i, phoneNumbers);
            List<CategoryAmountResponseDTO> results = getCategoryList(requestDTO,
                challetBankTransaction,
                challetBank, subListPhoneNumbers);
            addCategoryList(results, categorySums);
        }
        return categorySums;
    }

    private List<String> subList(int start, List<String> phoneNumbers) {
        int end = Math.min(start + BATCH_SIZE, phoneNumbers.size());
        return phoneNumbers.subList(start, end);
    }

    private List<CategoryAmountResponseDTO> getCategoryList(MonthlyTransactionRequestDTO requestDTO,
        QChalletBankTransaction challetBankTransaction, QChalletBank challetBank,
        List<String> subListPhoneNumbers) {
        return query
            .select(Projections.constructor(CategoryAmountResponseDTO.class,
                challetBankTransaction.category,
                challetBankTransaction.transactionAmount.sum(),
                challetBank.phoneNumber.countDistinct()))
            .from(challetBankTransaction)
            .join(challetBankTransaction.challetBank, challetBank)
            .where(
                challetBank.phoneNumber.in(subListPhoneNumbers)
                    .and(
                        challetBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                    .and(challetBankTransaction.transactionDatetime.month()
                        .eq(requestDTO.month()))
                    .and(challetBankTransaction.category.in(Category.COFFEE, Category.DELIVERY,
                        Category.SHOPPING, Category.TRANSPORT, Category.ETC)))
            .groupBy(challetBankTransaction.category)
            .fetch();
    }

    private static void addCategoryList(List<CategoryAmountResponseDTO> results,
        Map<Category, Long> categorySums) {
        for (CategoryAmountResponseDTO result : results) {
            categorySums.put(result.category(),
                categorySums.getOrDefault(result.category(), 0l) + (result.totalAmount()
                    / result.count()));
        }
    }
}