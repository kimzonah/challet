package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;

public interface ChalletBankService {

    void createAccount(String phoneNumber);

    AccountInfoResponseListDTO findAccount(String phoneNumber);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);
}
