package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDto;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import java.util.List;

public interface ChalletBankRepositoryCustom {

    AccountInfoResponseListDTO findByAccountInfo(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountInfo(Long accountId);

    TransactionDetailResponseDto getTransactionDetailById(Long transactionId);
}
