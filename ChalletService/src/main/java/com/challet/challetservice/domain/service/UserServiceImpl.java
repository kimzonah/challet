package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.UserUpdateNicknameRequestDTO;
import com.challet.challetservice.domain.dto.request.UserUpdateProfileRequestDTO;
import com.challet.challetservice.domain.dto.response.UserInfoResponseDTO;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public UserInfoResponseDTO getUserInfo(String header) {

        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        return UserInfoResponseDTO.fromUser(user);
    }

    @Override
    @Transactional
    public void updateNickname(String header, UserUpdateNicknameRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        user.updateNickname(request.nickname());
    }

    @Override
    @Transactional
    public void updateProfileImage(String header, UserUpdateProfileRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        user.updateProfileImage(request.profileImage());
    }
}
