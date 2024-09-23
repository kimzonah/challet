package com.challet.kbbankservice.domain.service;

import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseListDTO;

public interface KbBankService {

    AccountInfoResponseListDTO findAccount(String tokenHeader);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    void connectMyDataAccount(String phoneNumber);
}
