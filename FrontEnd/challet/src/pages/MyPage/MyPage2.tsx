import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import useFile2URL from '../../hooks/useFile2URL';
import useAuthStore from '../../store/useAuthStore';

import axiosInstance from '../../api/axiosInstance';
import Button from '../../components/Button/Button';
import NicknameModal from './NicknameModal';
import defaultProfileImage from '../../assets/mypage/default-profile.png';

const MyPage = () => {
  const navigate = useNavigate();
  const { file2URL } = useFile2URL();
  const { clearAuthData } = useAuthStore(); // Access Token 상태

  const [nickname, setNickname] = useState(''); // 닉네임 상태
  const [profileImageUrl, setProfileImageUrl] = useState(''); // 프로필 이미지 URL 상태
  const [profileImage, setProfileImage] = useState<File | null>(null); // 변경할 프로필 이미지 상태
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false); // 닉네임 수정 모달 상태

  // 로그인한 유저 정보 조회 API 호출
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/challet/users');
      setNickname(response.data.nickname || ''); // 닉네임 상태에 저장
      setProfileImageUrl(response.data.profileImage || defaultProfileImage); // 프로필 이미지 URL 상태에 저장, 없으면 기본 이미지 사용
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          '유저 정보 조회 실패:',
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error('유저 정보 조회 실패:', error.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData(); // 마이페이지 접근 시 유저 정보 조회
  }, [fetchUserData]);

  // 프로필 이미지 수정 API 요청
  const handleProfileImageChange = async () => {
    if (!profileImage) return;

    try {
      const urlIamge = await file2URL(profileImage);

      console.log(urlIamge);

      const response = await axiosInstance.patch(
        '/api/challet/users/profileImages',
        {
          profileImage: urlIamge,
        }
      );

      console.log('프로필 이미지 수정 성공:', response.data);
      alert('프로필 이미지가 수정되었습니다.');
      setProfileImageUrl(urlIamge);
    } catch (error) {
      console.error('프로필 이미지 수정 실패:', error);
    }
  };
  // 닉네임 변경 후 상태 업데이트
  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname); // 새로운 닉네임 상태 업데이트
    setIsNicknameModalOpen(false); // 모달 닫기
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    // Zustand에서 Access Token 초기화
    clearAuthData();
    // 로그인 페이지로 이동
    navigate('/login');
  };

  // 리워드 페이지로 이동 핸들러
  const handleGoToRewards = () => {
    navigate('/rewards');
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-3xl font-bold mb-4'>마이 페이지</h1>

      {/* 프로필 이미지 및 닉네임 표시 */}
      <div className='mb-4 text-center'>
        <img
          src={profileImageUrl || defaultProfileImage}
          alt='프로필 이미지'
          className='w-32 h-32 rounded-full mb-2 cursor-pointer'
          onClick={() => document.getElementById('fileInput')?.click()} // 프로필 이미지 클릭 시 파일 입력 열기
        />
        <input
          id='fileInput'
          type='file'
          accept='image/*' // 이미지 파일만 허용
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
          className='hidden'
        />
        <Button
          text='프로필 이미지 변경'
          className='mt-2'
          onClick={handleProfileImageChange}
        />
      </div>

      <div className='flex items-center'>
        <h2 className='text-2xl'>{nickname}</h2>
        <button
          className='ml-4 px-2 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600'
          onClick={() => setIsNicknameModalOpen(true)}
        >
          닉네임 수정
        </button>
      </div>

      {/* 리워드 페이지로 이동 버튼 */}
      <div className='mt-6'>
        <Button text='리워드 페이지로 이동' onClick={handleGoToRewards} />
      </div>

      {/* 닉네임 수정 모달 */}
      {isNicknameModalOpen && (
        <NicknameModal
          onNicknameChange={handleNicknameChange} // 닉네임 변경 함수 전달
          onClose={() => setIsNicknameModalOpen(false)} // 모달 닫기 함수 전달
        />
      )}

      {/* 로그아웃 버튼 */}
      <Button
        text='로그아웃'
        className='fixed-bottom-button'
        onClick={handleLogout}
      />
    </div>
  );
};

export default MyPage;
