package com.challet.shbankservice.domain.service;

import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.shbankservice.domain.repository.ShBankRepository;
import com.challet.shbankservice.global.exception.CustomException;
import com.challet.shbankservice.global.exception.ExceptionResponse;
import com.challet.shbankservice.global.util.JwtUtil;
import jakarta.transaction.Transactional;
import java.util.List;
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
}
