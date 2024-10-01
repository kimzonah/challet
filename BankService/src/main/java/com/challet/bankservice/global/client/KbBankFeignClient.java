package com.challet.bankservice.global.client;

import com.challet.bankservice.domain.dto.request.BankTransferRequestDTO;
import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "kb-bank")
public interface KbBankFeignClient {

    @PostMapping("/api/kb-bank/mydata-connect")
    AccountInfoResponseListDTO connectMyDataKbBank(
        @RequestHeader(value = "Authorization") String tokenHeader);

    @GetMapping("/api/kb-bank")
    AccountInfoResponseListDTO getMyDataKbBank(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader);

    @PostMapping("/api/kb-bank/account-transfers")
    BankTransferRequestDTO getTransferAccount(BankTransferResponseDTO responseDTO);

    @PostMapping("/api/kb-bank/transactions-monthly")
    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestBody MonthlyTransactionRequestDTO requestDTO);

    @PostMapping("/api/kb-bank/transaction-category")
    CategoryAmountResponseListDTO getTransactionGroupCategory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestBody MonthlyTransactionRequestDTO requestDTO);
}
