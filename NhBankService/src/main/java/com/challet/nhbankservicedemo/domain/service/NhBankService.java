package com.challet.nhbankservicedemo.domain.service;

import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseListDTO;

public interface NhBankService {

    AccountInfoResponseListDTO findAccount(String phoneNumber);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);
}