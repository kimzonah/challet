package com.challet.shbankservice.domain.service;

import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseListDTO;

public interface ShBankService {

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    void connectMyDataAccount(String tokenHeader);
}
