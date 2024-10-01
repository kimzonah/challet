package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.request.UserInfoMessageRequestDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.bankservice.domain.repository.ChalletBankRepository;
import com.challet.bankservice.global.client.ChalletFeignClient;
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
    private final ChalletFeignClient challetFeignClient;


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
    public CategoryAmountResponseListDTO getTransactionByGroupCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        
        /* 수정 필요
            각 은행별 전화번호로 카테고리 합 구하기
            마이데이터에 연결된 하나의 전화번호이기 때문에 여러 사용자일 경우의 로직 수정이 필요
            user 테이블에서 전화번호 리스트도 필요        
         */
        UserInfoMessageRequestDTO userInfo = challetFeignClient.getUserInfo(tokenHeader);

        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);

        CategoryAmountResponseListDTO chBankCategory = challetBankRepository.getTransactionByGroupCategory(
            phoneNumber, requestDTO);

        CategoryAmountResponseListDTO kbBankCategory = kbBankFeignClient.getTransactionGroupCategory(
            tokenHeader, requestDTO);

        CategoryAmountResponseListDTO nhBankCategory = nhBankFeignClient.getTransactionGroupCategory(
            tokenHeader, requestDTO);

        CategoryAmountResponseListDTO shBankCategory = shBankFeignClient.getTransactionGroupCategory(
            tokenHeader, requestDTO);

        return shBankCategory;
    }
}
