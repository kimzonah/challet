package com.challet.nhbankservicedemo.domain.service;

import com.challet.nhbankservicedemo.domain.dto.request.AccountTransferRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.BankTransferResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseListDTO;
import com.challet.nhbankservicedemo.domain.entity.Category;
import com.challet.nhbankservicedemo.domain.entity.NhBank;
import com.challet.nhbankservicedemo.domain.entity.NhBankTransaction;
import com.challet.nhbankservicedemo.domain.repository.NhBankRepository;
import com.challet.nhbankservicedemo.global.exception.CustomException;
import com.challet.nhbankservicedemo.global.exception.ExceptionResponse;
import com.challet.nhbankservicedemo.global.util.JwtUtil;
import com.querydsl.core.NonUniqueResultException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NhBankServiceImpl implements NhBankService {

    private final NhBankRepository nhBankRepository;
    private final JwtUtil jwtUtil;

    @Override
    public AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return nhBankRepository.getAccountInfoByPhoneNumber(
            loginUserPhoneNumber);
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = nhBankRepository.findAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = nhBankRepository.getTransactionByAccountId(
            accountId);

        return TransactionResponseListDTO
            .builder()
            .transactionCount((long) transactionList.size())
            .accountBalance(accountBalance)
            .transactionResponseDTO(transactionList).build();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionInfo(Long transactionId) {
        try {
            return Optional.ofNullable(
                    nhBankRepository.getTransactionDetailById(transactionId))
                .orElseThrow(() -> new ExceptionResponse(
                    CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));
        } catch (NonUniqueResultException e) {
            throw new ExceptionResponse(CustomException.NOT_GET_TRANSACTION_DETAIL_EXCEPTION);
        }
    }

    @Transactional
    @Override
    public void connectMyDataAccount(String tokenHeader) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        nhBankRepository.connectMyDataAccount(phoneNumber);
    }

    @Transactional
    @Override
    public BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO) {
        NhBank nhBank = nhBankRepository.findByAccountNumber(requestDTO.depositAccountNumber())
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));

        long accountTransactionBalance = nhBank.getAccountBalance() + requestDTO.amount();
        NhBankTransaction transaction = NhBankTransaction.createAccountTransferHistory(nhBank,
            requestDTO, accountTransactionBalance);

        nhBank.addTransaction(transaction);

        return BankTransferResponseDTO.fromBankTransferResponseDTO(nhBank);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        MonthlyTransactionHistoryListDTO transactions = nhBankRepository.getTransactionByPhoneNumberAndYearMonth(
            phoneNumber, requestDTO);

        return transactions;
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        BankToAnalysisMessageRequestDTO requestDTO) {
        return nhBankRepository.getTransactionByGroupCategory(requestDTO);
    }
}