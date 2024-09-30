package com.challet.nhbankservicedemo.domain.service;

import com.challet.nhbankservicedemo.domain.dto.request.AccountTransferRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.BankTransferResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseListDTO;

public interface NhBankService {

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    void connectMyDataAccount(String tokenHeader);

    BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO);

    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);
}