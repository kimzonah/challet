package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;

public interface ChalletBankService {

    void createAccount(String phoneNumber);

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String phoneNumber);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);
}
