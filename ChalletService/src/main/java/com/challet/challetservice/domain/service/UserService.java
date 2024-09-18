package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.UserUpdateNicknameRequestDTO;
import com.challet.challetservice.domain.dto.response.UserInfoResponseDTO;

public interface UserService {

    UserInfoResponseDTO getUserInfo(String header);

    void updateNickname(String header, UserUpdateNicknameRequestDTO request);
}
