package com.challet.kbbankservice.domain.repository;

import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseDTO;
import java.util.List;

public interface KbBankRepositoryCustom {

    AccountInfoResponseListDTO findByAccountInfo(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountInfo(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long findAccountBalanceById(Long accountId);
}
