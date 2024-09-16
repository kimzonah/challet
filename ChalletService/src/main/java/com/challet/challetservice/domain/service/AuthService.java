package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.TokenRefreshRequestDTO;
import com.challet.challetservice.domain.dto.request.UserLoginRequestDTO;
import com.challet.challetservice.domain.dto.request.UserRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.LoginResponseDTO;
import com.challet.challetservice.domain.dto.response.TokenRefreshResponseDTO;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    LoginResponseDTO signup(UserRegisterRequestDTO request, HttpServletResponse response);

    TokenRefreshResponseDTO refreshToken(TokenRefreshRequestDTO request);

    LoginResponseDTO login(UserLoginRequestDTO request, HttpServletResponse response);
}
