package com.challet.shbankservice.domain.service;

import com.challet.shbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.shbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.shbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.shbankservice.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.shbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.shbankservice.domain.entity.Category;
import java.util.Map;

public interface ShBankService {

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    void connectMyDataAccount(String tokenHeader);

    BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO);

    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);

    Map<Category, Long> getTransactionByGroupCategory(BankToAnalysisMessageRequestDTO requestDTO);
}
