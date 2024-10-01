package com.challet.kbbankservice.domain.service;

import com.challet.kbbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.kbbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.kbbankservice.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.kbbankservice.domain.entity.KbBank;
import com.challet.kbbankservice.domain.entity.KbBankTransaction;
import com.challet.kbbankservice.domain.repository.KbBankRepository;
import com.challet.kbbankservice.global.exception.CustomException;
import com.challet.kbbankservice.global.exception.ExceptionResponse;
import com.challet.kbbankservice.global.util.JwtUtil;
import com.querydsl.core.NonUniqueResultException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class KbBankServiceImpl implements KbBankService {

    private final KbBankRepository kbBankRepository;
    private final JwtUtil jwtUtil;

    @Override
    public AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return kbBankRepository.getAccountInfoByPhoneNumber(
            loginUserPhoneNumber);
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = kbBankRepository.findAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = kbBankRepository.getTransactionByAccountId(
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
                    kbBankRepository.getTransactionDetailById(transactionId))
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
        kbBankRepository.connectMyDataAccount(phoneNumber);
    }

    @Override
    @Transactional
    public BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO) {
        KbBank kbBank = kbBankRepository.findByAccountNumber(requestDTO.depositAccountNumber())
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));

        long accountTransactionBalance = kbBank.getAccountBalance() + requestDTO.amount();
        KbBankTransaction transaction = KbBankTransaction.createAccountTransferHistory(kbBank,
            requestDTO, accountTransactionBalance);

        kbBank.addTransaction(transaction);

        return BankTransferResponseDTO.fromBankTransferResponseDTO(kbBank);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return kbBankRepository.getTransactionByPhoneNumberAndYearMonth(phoneNumber, requestDTO);
    }

    @Override
    public CategoryAmountResponseListDTO getTransactionByGroupCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return kbBankRepository.getTransactionByGroupCategory(phoneNumber, requestDTO);
    }
}
