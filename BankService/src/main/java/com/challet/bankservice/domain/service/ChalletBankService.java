package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.BankSelectionRequestDTO;
import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.MyDataBankAccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;

public interface ChalletBankService {

    void createAccount(String phoneNumber);

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String phoneNumber);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    PaymentResponseDTO qrPayment(Long accountId, PaymentRequestDTO paymentRequestDTO);

    MyDataBankAccountInfoResponseDTO connectMyDataBanks(String tokenHeder, BankSelectionRequestDTO bankSelectionRequestDTO);
}
