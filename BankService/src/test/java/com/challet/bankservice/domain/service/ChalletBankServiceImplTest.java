package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.bankservice.domain.entity.ChalletBank;
import com.challet.bankservice.domain.repository.ChalletBankRepository;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ChalletBankServiceImplTest {

    @Autowired
    private ChalletBankService challetBankService;

    @Autowired
    private ChalletBankRepository challetBankRepository;
    
    /*
    // ChallBank entity의 builder 추가 필요

    @BeforeEach
    public void before(){
        challetBankRepository.save(ChalletBank.createAccountTest("01012345678", 100, "123123123123"));
    }
    */

    @Test
    @DisplayName("동시에 100개의 결제로 잔액을 감소시킨다.")
    void qrPayment() throws InterruptedException {
        ChalletBank challetBank = challetBankRepository.findById(1L).orElseThrow();
        System.out.println(challetBank.getAccountBalance());

        //1. 결제 내용(결제 금액, 전화번호, 거래처, 카테고리)
        PaymentRequestDTO paymentRequestDTO = new PaymentRequestDTO(1L, "01012345678", "test1", "DELIVERY");

        //2. 110번의 결제
        int threadCount = 110;
        CountDownLatch countDownLatch = new CountDownLatch(threadCount);

        // 동시에 실행할 스레드 개수
        ExecutorService executorService = Executors.newFixedThreadPool(32);

        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> {
                try {
                    //3. 결제 계좌ID, 결제내역
                    challetBankService.qrPayment(1L, paymentRequestDTO);
                }catch (Exception e) {
                    // 잔액 부족 시 발생하는 예외를 처리
                    System.out.println("예외 발생: " + e.getMessage());
                } finally {
                    countDownLatch.countDown();
                }
            });
        }

        // 모든 스레드가 완료될 때까지 대기
        countDownLatch.await();

        //4. 잔액을 확인하기 위해 1번째 계좌 정보를 가져옵니다
        ChalletBank updatedChalletBank = challetBankRepository.findById(1L).orElseThrow();
        Long updateAccountBalance = updatedChalletBank.getAccountBalance();


        //5. 예상 잔액으로 검증 (동시성 문제 해결 시 정상적으로 동작해야 함)
        Assertions.assertThat(updateAccountBalance).isEqualTo(0);
    }
}