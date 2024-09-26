package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.UserUpdateNicknameRequestDTO;
import com.challet.challetservice.domain.dto.request.UserUpdateProfileRequestDTO;
import com.challet.challetservice.domain.dto.response.MyRewardListResponseDTO;
import com.challet.challetservice.domain.dto.response.RewardDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.UserInfoResponseDTO;

public interface UserService {

    UserInfoResponseDTO getUserInfo(String header);

    void updateNickname(String header, UserUpdateNicknameRequestDTO request);

    void updateProfileImage(String header, UserUpdateProfileRequestDTO request);

    MyRewardListResponseDTO getMyRewards(String header);

    RewardDetailResponseDTO getRewardDetail(String header, Long id);
}
