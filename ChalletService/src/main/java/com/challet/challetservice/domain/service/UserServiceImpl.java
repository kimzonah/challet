package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.response.UserInfoResponseDTO;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public UserInfoResponseDTO getUserInfo(String header) {

        String loginUser = jwtUtil.getLoginUser(header);
        User user = userRepository.findByPhoneNumber(loginUser)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        return UserInfoResponseDTO.fromUser(user);
    }
}
