package com.challet.kbbankservice.domain.service;

import com.challet.kbbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.AccountTransferResponseDTO;
import com.challet.kbbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseListDTO;

public interface KbBankService {

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    void connectMyDataAccount(String tokenHeader);

    BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO);
}
