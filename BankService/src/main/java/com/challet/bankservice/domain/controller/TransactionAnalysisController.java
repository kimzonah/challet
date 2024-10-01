package com.challet.bankservice.domain.controller;

import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.bankservice.domain.service.TransactionAnalysisService;
import com.challet.bankservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ch-bank")
@RequiredArgsConstructor
@Tag(name = "TransactionAnalysisController", description = "거래 내역 분석 컨트롤러")
public class TransactionAnalysisController {

    private final TransactionAnalysisService transactionAnalysisService;

    @GetMapping("/transactions-monthly")
    @Operation(summary = "달별 결제내역", description = "전화번호와 이번년도 이번달 데이터를 통해 달별 결제내역 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "분석 성공"),
        @ApiResponse(responseCode = "400", description = "분석 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<MonthlyTransactionHistoryListDTO> getMonthlyTransactionHistory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestBody MonthlyTransactionRequestDTO requestDTO
    ) {
        MonthlyTransactionHistoryListDTO monthlyTransactionHistory = transactionAnalysisService.getMonthlyTransactionHistory(
            tokenHeader, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(monthlyTransactionHistory);
    }

    @GetMapping("/age-gender-comparisons")
    @Operation(summary = "성별,나이 분석 조회", description = "성별,나이,이번달 데이터를 통해 모든 사용자 계좌 전월 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "분석 성공"),
        @ApiResponse(responseCode = "400", description = "분석 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<?> getTransactionAnalysisByGenderAndAge() {
        return null;
    }

    @GetMapping("/transaction-category")
    public ResponseEntity<List<CategoryAmountResponseDTO>> getTransactionGroupCategory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestBody MonthlyTransactionRequestDTO requestDTO) {

        List<CategoryAmountResponseDTO> transactionByGroupCategory = transactionAnalysisService.getTransactionByGroupCategory(
            tokenHeader, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(transactionByGroupCategory);
    }
}
