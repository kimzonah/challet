package com.challet.nhbankservicedemo.domain.repository;

import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseDTO;
import java.util.List;

public interface NhBankRepositoryCustom {

    AccountInfoResponseListDTO findByAccountInfo(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountInfo(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long findAccountBalanceById(Long accountId);
}