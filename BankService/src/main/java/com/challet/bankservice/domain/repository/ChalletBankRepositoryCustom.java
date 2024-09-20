package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import java.util.List;

public interface ChalletBankRepositoryCustom {

    AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountId(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long findAccountBalanceById(Long accountId);
}
