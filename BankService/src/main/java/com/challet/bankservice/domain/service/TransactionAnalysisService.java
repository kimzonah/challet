package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import java.util.List;

public interface TransactionAnalysisService {

    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);

    CategoryAmountResponseListDTO getTransactionByGroupCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);
}
