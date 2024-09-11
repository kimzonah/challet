package com.challet.bankservice.domain.controller;

import com.challet.bankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionHistoryResponseDTO;
import com.challet.bankservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bank-service")
@Tag(name = "ChalletController", description="챌렛 은행 컨트롤러")
public class BankController {

    @GetMapping("/")
    @Operation(summary = "챌렛은행 조회", description = "전화번호를 이용하여 계좌를 조회합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "계좌 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<AccountInfoResponseDTO> getAccountInfo() {

        return null;
    }

    @GetMapping("/challet-banks")
    @Operation(summary = "챌렛계좌 내역 조회", description = "계좌id를 이용하여 조회합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "계좌 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<List<TransactionHistoryResponseDTO>> getAccountTransactions() {

        return null;
    }

    @PostMapping("/challet-banks")
    @Operation(summary = "챌렛은행 계좌 생성", description = "계좌를 생성하며 입력받은 전화번호를 ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "계좌 생성 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 생성 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity createAccount(@RequestBody String phoneNumber) {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
