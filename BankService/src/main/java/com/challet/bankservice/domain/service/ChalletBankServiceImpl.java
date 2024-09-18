package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.bankservice.domain.entity.ChalletBank;
import com.challet.bankservice.domain.repository.ChalletBankRepository;
import com.challet.bankservice.global.exception.CustomException;
import com.challet.bankservice.global.exception.ExceptionResponse;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChalletBankServiceImpl implements ChalletBankService {

    private final ChalletBankRepository challetBankRepository;
    private final Environment env;

    @Override
    public void createAccount(String phoneNumber) {
        for (int retry = 0; retry < 6; retry++) {
            String accountNum = createAccountNum();
            try {
                saveAccount(phoneNumber, accountNum);
                return;
            } catch (DataIntegrityViolationException e) {
                log.warn("중복된 계좌 번호 발견, 다시 생성합니다. 중복 계좌 번호: " + accountNum);
            }
        }
        throw new ExceptionResponse(CustomException.NOT_CREATE_USER_ACCOUNT_EXCEPTION);
    }

    @Override
    public AccountInfoResponseListDTO findAccount(String phoneNumber) {
        AccountInfoResponseListDTO accountInfo = challetBankRepository.findByAccountInfo(
            phoneNumber);
        if (accountInfo.accountCount() == 0) {
            throw new ExceptionResponse(CustomException.NOT_FOUND_USER_ACCOUNT_EXCEPTION);
        }
        return accountInfo;
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = challetBankRepository.findAccountBalanceById(accountId).orElse(0L);
        List<TransactionResponseDTO> transactionList = challetBankRepository.getTransactionByAccountInfo(
            accountId);
        return new TransactionResponseListDTO(transactionList.stream().count(), accountBalance,
            transactionList);
    }

    @Transactional
    protected void saveAccount(String phoneNumber, String accountNum) {
        ChalletBank account = ChalletBank.createAccount(phoneNumber, accountNum);
        challetBankRepository.save(account);
    }

    private String createAccountNum() {
        String bankCode = env.getProperty("server.port", "8000");  // 은행 코드
        String accountType = "01";  // 계좌 유형

        // 밀리초 단위 시간에서 마지막 6자리 사용
        String timePart = generateTimeBasedCode();

        // 4자리 난수 생성
        String randomPart = generateRandomNumber(4);

        return bankCode + accountType + timePart + randomPart;
    }

    private String generateTimeBasedCode() {
        long currentTimeInMillis = System.currentTimeMillis();
        long currentTimeInSeconds = currentTimeInMillis / 1000;

        // 초 단위로 변환된 시간에서 마지막 6자리 추출
        return String.valueOf(currentTimeInSeconds).substring(4);
    }

    private String generateRandomNumber(int size) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}