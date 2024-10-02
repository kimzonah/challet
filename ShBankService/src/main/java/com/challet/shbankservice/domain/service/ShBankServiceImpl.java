package com.challet.shbankservice.domain.service;

import com.challet.shbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.shbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.shbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.shbankservice.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.shbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.shbankservice.domain.entity.Category;
import com.challet.shbankservice.domain.entity.ShBank;
import com.challet.shbankservice.domain.entity.ShBankTransaction;
import com.challet.shbankservice.domain.repository.ShBankRepository;
import com.challet.shbankservice.global.exception.CustomException;
import com.challet.shbankservice.global.exception.ExceptionResponse;
import com.challet.shbankservice.global.util.JwtUtil;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.hibernate.NonUniqueResultException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShBankServiceImpl implements ShBankService {

    private final ShBankRepository shBankRepository;
    private final JwtUtil jwtUtil;

    @Override
    public AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return shBankRepository.getAccountInfoByPhoneNumber(
            loginUserPhoneNumber);
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = shBankRepository.getAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = shBankRepository.getTransactionByAccountId(
            accountId);

        return TransactionResponseListDTO
            .builder()
            .transactionCount((long) transactionList.size())
            .accountBalance(accountBalance)
            .transactionResponseDTO(transactionList).build();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionInfo(Long transactionId) {
        try {
            return Optional.ofNullable(
                    shBankRepository.getTransactionDetailById(transactionId))
                .orElseThrow(() -> new ExceptionResponse(
                    CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));
        } catch (NonUniqueResultException e) {
            throw new ExceptionResponse(CustomException.NOT_GET_TRANSACTION_DETAIL_EXCEPTION);
        }
    }

    @Transactional
    @Override
    public void connectMyDataAccount(String tokenHeader) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        shBankRepository.connectMyDataAccount(phoneNumber);
    }

    @Transactional
    @Override
    public BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO) {
        ShBank shBank = shBankRepository.findByAccountNumber(requestDTO.depositAccountNumber())
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));

        long accountTransactionBalance = shBank.getAccountBalance() + requestDTO.amount();
        ShBankTransaction transaction = ShBankTransaction.createAccountTransferHistory(shBank,
            requestDTO, accountTransactionBalance);

        shBank.addTransaction(transaction);

        return BankTransferResponseDTO.fromBankTransferResponseDTO(shBank);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        MonthlyTransactionHistoryListDTO transactions = shBankRepository.getTransactionByPhoneNumberAndYearMonth(
            phoneNumber, requestDTO);

        return transactions;
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        BankToAnalysisMessageRequestDTO requestDTO) {
        return shBankRepository.getTransactionByGroupCategory(requestDTO);
    }
}
