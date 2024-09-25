package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.BankSelectionDTO;
import com.challet.bankservice.domain.dto.request.BankSelectionRequestDTO;
import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.MyDataBankAccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.bankservice.domain.entity.Category;
import com.challet.bankservice.domain.entity.ChalletBank;
import com.challet.bankservice.domain.entity.ChalletBankTransaction;
import com.challet.bankservice.domain.repository.ChalletBankRepository;
import com.challet.bankservice.global.client.KbBankFeignClient;
import com.challet.bankservice.global.client.NhBankFeignClient;
import com.challet.bankservice.global.client.ShBankFeignClient;
import com.challet.bankservice.global.exception.CustomException;
import com.challet.bankservice.global.exception.ExceptionResponse;
import com.challet.bankservice.global.util.JwtUtil;
import com.querydsl.core.NonUniqueResultException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    private final JwtUtil jwtUtil;
    private final KbBankFeignClient kbBankFeignClient;
    private final NhBankFeignClient nhBankFeignClient;
    private final ShBankFeignClient shBankFeignClient;

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
    public AccountInfoResponseListDTO getAccountsByPhoneNumber(String header) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        AccountInfoResponseListDTO accountInfo = challetBankRepository.getAccountInfoByPhoneNumber(
            phoneNumber);
        if (accountInfo.accountCount() == 0) {
            throw new ExceptionResponse(CustomException.NOT_FOUND_USER_ACCOUNT_EXCEPTION);
        }
        return accountInfo;
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = challetBankRepository.findAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = challetBankRepository.getTransactionByAccountId(
            accountId);

        return TransactionResponseListDTO
            .builder()
            .transactionCount(transactionList.stream().count())
            .accountBalance(accountBalance)
            .transactionResponseDTO(transactionList).build();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionInfo(Long transactionId) {
        try {
            return Optional.ofNullable(
                    challetBankRepository.getTransactionDetailById(transactionId))
                .orElseThrow(() -> new ExceptionResponse(
                    CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));
        } catch (NonUniqueResultException e) {
            throw new ExceptionResponse(CustomException.NOT_GET_TRANSACTION_DETAIL_EXCEPTION);
        }
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

    @Transactional
    @Override
    public PaymentResponseDTO qrPayment(Long accountId,
        PaymentRequestDTO paymentRequestDTO) {
        ChalletBank challetBank = getChalletBank(accountId);

        long transactionBalance = calculateTransactionBalance(challetBank,
            paymentRequestDTO.transactionAmount());

        ChalletBankTransaction paymentTransaction = createTransaction(challetBank,
            paymentRequestDTO, transactionBalance);

        challetBank.addTransaction(paymentTransaction);

        return createPaymentResponse(paymentRequestDTO);
    }

    private ChalletBank getChalletBank(Long accountId) {
        return challetBankRepository.findByIdWithLock(accountId);
    }

    private long calculateTransactionBalance(ChalletBank challetBank, long transactionAmount) {
        long transactionBalance = challetBank.getAccountBalance() - transactionAmount;
        if (transactionBalance < 0) {
            throw new ExceptionResponse(CustomException.NOT_ENOUGH_FUNDS_EXCEPTION);
        }
        return transactionBalance;
    }

    private ChalletBankTransaction createTransaction(ChalletBank challetBank,
        PaymentRequestDTO paymentRequestDTO, long transactionBalance) {
        return ChalletBankTransaction.builder()
            .transactionAmount(paymentRequestDTO.transactionAmount())
            .transactionDatetime(LocalDateTime.now())
            .deposit(paymentRequestDTO.accountNumber())
            .withdrawal(paymentRequestDTO.withdrawal())
            .transactionBalance(transactionBalance)
            .category(Category.valueOf(paymentRequestDTO.category()))
            .build();
    }

    private PaymentResponseDTO createPaymentResponse(PaymentRequestDTO paymentRequestDTO) {
        return PaymentResponseDTO.builder()
            .transactionAmount(paymentRequestDTO.transactionAmount())
            .deposit(paymentRequestDTO.withdrawal())
            .category(paymentRequestDTO.category())
            .build();
    }

    @Override
    public MyDataBankAccountInfoResponseDTO connectMyDataBanks(String tokenHeader,
        BankSelectionRequestDTO bankSelectionRequestDTO) {

        setMyDataAuth(tokenHeader);

        AccountInfoResponseListDTO kbBanks = null;
        AccountInfoResponseListDTO nhBanks = null;
        AccountInfoResponseListDTO shBanks = null;

        for (BankSelectionDTO bank : bankSelectionRequestDTO.selectedBanks()) {
            kbBanks = getKbBankAccounts(tokenHeader, bank, kbBanks);
            nhBanks = getNhBankAccounts(tokenHeader, bank, nhBanks);
            shBanks = getShBankAccounts(tokenHeader, bank, shBanks);
        }

        return getMyDataAccounts(kbBanks, nhBanks, shBanks);
    }

    private void setMyDataAuth(String tokenHeder) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeder);
        challetBankRepository.setMyDataAuthorization(phoneNumber);
    }

    private AccountInfoResponseListDTO getKbBankAccounts(String tokenHeader,
        BankSelectionDTO bank, AccountInfoResponseListDTO kbBanks) {
        if (bank.bankCode().equals("8083") && bank.isSelected()) {
            kbBanks = kbBankFeignClient.connectMyDataKbBank(
                tokenHeader);
        }
        return kbBanks;
    }

    private AccountInfoResponseListDTO getNhBankAccounts(String tokenHeder,
        BankSelectionDTO bank, AccountInfoResponseListDTO nhBanks) {
        if (bank.bankCode().equals("8084") && bank.isSelected()) {
            nhBanks = nhBankFeignClient.connectMyDataKbBank(tokenHeder);
        }
        return nhBanks;
    }

    private AccountInfoResponseListDTO getShBankAccounts(String tokenHeder,
        BankSelectionDTO bank, AccountInfoResponseListDTO shBanks) {
        if (bank.bankCode().equals("8085") && bank.isSelected()) {
            shBanks = shBankFeignClient.connectMyDataKbBank(tokenHeder);
        }
        return shBanks;
    }

    private MyDataBankAccountInfoResponseDTO getMyDataAccounts(AccountInfoResponseListDTO kbBanks,
        AccountInfoResponseListDTO nhBanks, AccountInfoResponseListDTO shBanks) {
        return MyDataBankAccountInfoResponseDTO
            .builder()
            .kbBanks(kbBanks)
            .nhBanks(nhBanks)
            .shBanks(shBanks)
            .build();
    }

    @Override
    public MyDataBankAccountInfoResponseDTO getMyDataAccounts(String tokenHeader) {

        AccountInfoResponseListDTO kbBanks = kbBankFeignClient.getMyDataKbBank(tokenHeader);
        AccountInfoResponseListDTO nhBanks = nhBankFeignClient.getMyDataKbBank(tokenHeader);
        AccountInfoResponseListDTO shBanks = shBankFeignClient.getMyDataKbBank(tokenHeader);

        return getMyDataAccounts(kbBanks, nhBanks, shBanks);
    }
}