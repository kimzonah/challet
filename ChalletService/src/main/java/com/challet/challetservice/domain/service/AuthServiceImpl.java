package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.CheckDuplicateRequestDTO;
import com.challet.challetservice.domain.dto.request.UserLoginRequestDTO;
import com.challet.challetservice.domain.dto.request.UserRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.CheckDuplicateResponseDTO;
import com.challet.challetservice.domain.dto.response.LoginResponseDTO;
import com.challet.challetservice.domain.dto.response.TokenRefreshResponseDTO;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.client.ChBankFeignClient;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final ChBankFeignClient chBankFeignClient;

    @Override
    @Transactional
    public LoginResponseDTO signup(UserRegisterRequestDTO request, HttpServletResponse response) {

        if (userRepository.existsByPhoneNumber(request.phoneNumber())) {
            throw new ExceptionResponse(CustomException.USER_ALREADY_EXISTS_EXCEPTION);
        }

        User user = User.createUser(request, jwtUtil);
        User savedUser = userRepository.save(user);

        // 전화번호 token을 ch-bank에 전달하여 계좌 생성
        ResponseEntity<String> responseAccount = chBankFeignClient.requestCreateChBankAccount(
            request.phoneNumber());
        if(responseAccount.getStatusCode() != HttpStatus.CREATED){
            throw new ExceptionResponse(CustomException.Fail_ACCOUNT_CREATION_FAILED);
        }

        Cookie cookie = createRefreshTokenCookie(user.getRefreshToken());
        response.addCookie(cookie);

        String accessToken = jwtUtil.generateAccessToken(request.phoneNumber());
        Long userId = savedUser.getId();
        return new LoginResponseDTO(accessToken, userId);
    }

    @Override
    @Transactional
    public LoginResponseDTO login(UserLoginRequestDTO request, HttpServletResponse response) {

        User user = userRepository.findByPhoneNumber(request.phoneNumber())
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        if (!user.getPassword().equals(request.password())) {
            throw new ExceptionResponse(CustomException.PASSWORD_MISMATCH_EXCEPTION);
        }

        String refreshToken = jwtUtil.generateRefreshToken(request.phoneNumber());
        user.updateRefreshToken(refreshToken);
        userRepository.save(user);

        Cookie cookie = createRefreshTokenCookie(user.getRefreshToken());
        response.addCookie(cookie);

        String accessToken = jwtUtil.generateAccessToken(request.phoneNumber());
        Long userId = user.getId();
        return new LoginResponseDTO(accessToken, userId);
    }

    @Override
    public CheckDuplicateResponseDTO checkDuplicate(CheckDuplicateRequestDTO request) {
        Boolean result = userRepository.existsByPhoneNumber(request.phoneNumber());
        return new CheckDuplicateResponseDTO(result);
    }

    @Override
    public TokenRefreshResponseDTO refreshToken(HttpServletRequest request) {
        String refreshToken = getRefreshTokenFromCookie(request);

        // 리프레시 토큰이 유효한지 먼저 확인
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new ExceptionResponse(CustomException.INVALID_TOKEN_EXCEPTION);
        }

        // 해당 리프레시 토큰을 갖는 user가 있는지 확인
        User user = userRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        // user의 번호와 token에 담긴 정보가 같은지 확인
        if (!user.getPhoneNumber().equals(jwtUtil.getPhoneNumber(refreshToken))) {
            throw new ExceptionResponse(CustomException.INVALID_TOKEN_EXCEPTION);
        }

        return new TokenRefreshResponseDTO(jwtUtil.generateAccessToken(user.getPhoneNumber()));
    }

    public static Cookie createRefreshTokenCookie(String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        cookie.setSecure(true);
        return cookie;
    }

    public static String getRefreshTokenFromCookie(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        return Optional.ofNullable(cookies).stream().flatMap(Arrays::stream)
            .filter(cookie -> "refreshToken".equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_REFRESH_TOKEN_EXCEPTION));

    }

}