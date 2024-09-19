package com.challet.nhbankservicedemo.domain.service;

import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseListDTO;
import com.challet.nhbankservicedemo.domain.repository.NhBankRepository;
import com.challet.nhbankservicedemo.global.exception.CustomException;
import com.challet.nhbankservicedemo.global.exception.ExceptionResponse;
import com.querydsl.core.NonUniqueResultException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NhBankServiceImpl implements NhBankService {

    private final NhBankRepository nhBankRepository;

    @Override
    public AccountInfoResponseListDTO findAccount(String phoneNumber) {
        AccountInfoResponseListDTO accountInfo = nhBankRepository.findByAccountInfo(
            phoneNumber);
        return accountInfo;
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = nhBankRepository.findAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = nhBankRepository.getTransactionByAccountInfo(
            accountId);

        return TransactionResponseListDTO
            .builder()
            .transactionCount(transactionList.stream().count())
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
}