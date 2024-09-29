package com.challet.shbankservice.domain.repository;

import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.shbankservice.domain.entity.ShBank;
import java.util.List;
import java.util.Optional;

public interface ShBankRepositoryCustom {

    AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountId(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long getAccountBalanceById(Long accountId);

    void connectMyDataAccount(String phoneNumber);

    Optional<ShBank> findByAccountNumber(String accountNumber);
}
