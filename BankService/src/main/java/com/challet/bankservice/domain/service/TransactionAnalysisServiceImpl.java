package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.bankservice.domain.repository.ChalletBankRepository;
import com.challet.bankservice.global.client.KbBankFeignClient;
import com.challet.bankservice.global.client.NhBankFeignClient;
import com.challet.bankservice.global.client.ShBankFeignClient;
import com.challet.bankservice.global.util.JwtUtil;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionAnalysisServiceImpl implements TransactionAnalysisService {

    private final ChalletBankRepository challetBankRepository;
    private final JwtUtil jwtUtil;
    private final KbBankFeignClient kbBankFeignClient;
    private final NhBankFeignClient nhBankFeignClient;
    private final ShBankFeignClient shBankFeignClient;


    @Override
    public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {

        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        MonthlyTransactionHistoryListDTO chMonthlyTransaction = challetBankRepository.getTransactionByPhoneNumberAndYearMonth(
            phoneNumber, requestDTO);

        MonthlyTransactionHistoryListDTO kbMonthlyTransaction = kbBankFeignClient.getMonthlyTransactionHistory(
            tokenHeader, requestDTO);

        MonthlyTransactionHistoryListDTO nhMonthlyTransaction = nhBankFeignClient.getMonthlyTransactionHistory(
            tokenHeader, requestDTO);

        MonthlyTransactionHistoryListDTO shMonthlyTransaction = shBankFeignClient.getMonthlyTransactionHistory(
            tokenHeader, requestDTO);

        List<MonthlyTransactionHistoryDTO> allTransactions = new ArrayList<>();
        allTransactions.addAll(chMonthlyTransaction.monthlyTransactions());
        allTransactions.addAll(kbMonthlyTransaction.monthlyTransactions());
        allTransactions.addAll(nhMonthlyTransaction.monthlyTransactions());
        allTransactions.addAll(shMonthlyTransaction.monthlyTransactions());

        allTransactions.sort(Comparator.comparing(MonthlyTransactionHistoryDTO::transactionDate).reversed());

        MonthlyTransactionHistoryListDTO sortedTransactions = MonthlyTransactionHistoryListDTO.from(allTransactions);

        return sortedTransactions;
    }

    @Override
    public List<CategoryAmountResponseDTO> getTransactionByGroupCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return challetBankRepository.getTransactionByGroupCategory(phoneNumber, requestDTO);
    }
}
