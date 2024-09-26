package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.request.CheckDuplicateRequestDTO;
import com.challet.challetservice.domain.dto.request.UserLoginRequestDTO;
import com.challet.challetservice.domain.dto.request.UserRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.CheckDuplicateResponseDTO;
import com.challet.challetservice.domain.dto.response.LoginResponseDTO;
import com.challet.challetservice.domain.dto.response.TokenRefreshResponseDTO;
import com.challet.challetservice.domain.service.AuthService;
import com.challet.challetservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/challet/auth")
@RequiredArgsConstructor
@Tag(name = "AuthController", description = "인증 컨트롤러 - 토큰 없이 요청 가능")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입 (완료)", description = "회원정보를 입력하여 회원가입")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "회원가입 성공"),
        @ApiResponse(responseCode = "400", description = "회원가입 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/signup")
    public ResponseEntity<LoginResponseDTO> signup(@Valid @RequestBody UserRegisterRequestDTO request,
        HttpServletResponse response) {
        LoginResponseDTO result = authService.signup(request, response);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }


    @Operation(summary = "로그인 (완료)", description = "가입한 전화번호와 비밀번호를 입력하여 로그인")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "로그인 성공"),
        @ApiResponse(responseCode = "400", description = "로그인 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
        @ApiResponse(responseCode = "401", description = "비밀번호 오류로 인한 로그인 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody UserLoginRequestDTO request,
        HttpServletResponse response) {
        LoginResponseDTO result = authService.login(request, response);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Operation(summary = "토큰 재발급 (완료)", description = "리프레시 토큰을 입력 받아 액세스 토큰 재발급")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "토큰 재발급 성공"),
        @ApiResponse(responseCode = "400", description = "토큰 재발급 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
        @ApiResponse(responseCode = "401", description = "유효하지 않은 토큰", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponseDTO> refreshToken(HttpServletRequest request) {
        TokenRefreshResponseDTO token = authService.refreshToken(request);
        return ResponseEntity.status(HttpStatus.OK).body(token);
    }

    @Operation(summary = "회원 중복 검사 (완료)", description = "전화번호를 입력받아 이미 가입한 회원인지 검사")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "요청 성공"),
        @ApiResponse(responseCode = "400", description = "요청 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/check-duplicate")
    public ResponseEntity<CheckDuplicateResponseDTO> checkDuplicate(@RequestBody CheckDuplicateRequestDTO request){
        CheckDuplicateResponseDTO result = authService.checkDuplicate(request);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
