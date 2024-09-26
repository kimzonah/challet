import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import useFile2URL from '../../hooks/useFile2URL';
import useAuthStore from '../../store/useAuthStore';
import axiosInstance from '../../api/axiosInstance';
import Button from '../../components/Button/Button';
import defaultProfileImage from '../../assets/mypage/default-profile.png';

const MyPage = () => {
  const navigate = useNavigate();
  const { file2URL } = useFile2URL();
  const { clearAuthData, accessToken } = useAuthStore(); // Access Token 상태
  const [nickname, setNickname] = useState(''); // 닉네임 상태
  const [profileImageUrl, setProfileImageUrl] = useState(''); // 프로필 이미지 URL 상태
  const [newNickname, setNewNickname] = useState(''); // 변경할 닉네임 상태
  const [profileImage, setProfileImage] = useState<File | null>(null); // 변경할 프로필 이미지 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태

  // 로그인한 유저 정보 조회 API 호출
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/challet/users');
      setNickname(response.data.nickname || ''); // 닉네임 상태에 저장
      setProfileImageUrl(response.data.profileImage || defaultProfileImage); // 프로필 이미지 URL 상태에 저장, 없으면 기본 이미지 사용
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data || '유저 정보 조회 실패');
        console.error(
          '유저 정보 조회 실패:',
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        setErrorMessage('유저 정보 조회 실패');
        console.error('유저 정보 조회 실패:', error.message);
      }
    }
  }, []); // accessToken을 의존성으로 설정

  useEffect(() => {
    fetchUserData(); // 마이페이지 접근 시 유저 정보 조회
  }, [fetchUserData]); // fetchUserData를 의존성 배열에 추가

  // 닉네임 수정 API 요청
  const handleNicknameChange = async () => {
    if (!newNickname.trim()) {
      setErrorMessage('닉네임을 입력하세요.');
      return;
    }

    try {
      // 닉네임 수정 API 요청
      const response = await axiosInstance.patch(
        '/api/challet/users/nicknames',
        {
          nickname: newNickname,
        }
      );
      console.log('닉네임 수정 성공:', response.data);
      alert('닉네임이 수정되었습니다.');

      // 새로운 닉네임 상태 반영
      setNickname(newNickname);
      setNewNickname(''); // 수정 완료 후 입력란 초기화
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          '닉네임 수정 실패:',
          error.response?.data || error.message
        );
        setErrorMessage('닉네임 수정 실패');
      } else {
        console.error('닉네임 수정 실패: 알 수 없는 오류 발생');
        setErrorMessage('닉네임 수정 실패');
      }
    }
  };

  // 프로필 이미지 수정 API 요청
  const handleProfileImageChange = async () => {
    if (!profileImage) return;

    // Zustand 상태에서 필요한 값들 가져오기
    const { accessToken } = useAuthStore.getState();

    // accessToken이 없는 경우 처리
    if (!accessToken) {
      console.error('Access token is missing.');
      return;
    }

    try {
      const urlIamge = await file2URL(profileImage);

      console.log(urlIamge);

      // 프로필 이미지 수정 API 호출
      const response = await axiosInstance.patch(
        '/api/challet/users/profileImages',
        {
          profileImage: urlIamge,
        }
      );

      console.log('프로필 이미지 수정 성공:', response.data);
      alert('프로필 이미지가 수정되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 수정 실패:', error);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    console.log('로그아웃 전 Access Token:', accessToken);

    // Zustand에서 Access Token 초기화
    clearAuthData();

    // 상태가 업데이트된 후 Access Token을 다시 확인
    const updatedAccessToken = useAuthStore.getState().accessToken;
    console.log('로그아웃 후 Access Token:', updatedAccessToken);

    // 로그인 페이지로 이동
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-3xl font-bold mb-4'>마이 페이지</h1>

      {/* 프로필 이미지 및 닉네임 표시 */}
      <div className='mb-4'>
        <p>현재 닉네임: {nickname}</p>
        <img
          src={profileImageUrl || defaultProfileImage}
          alt='프로필 이미지'
          className='w-32 h-32 rounded-full mb-4'
        />
      </div>

      {/* 프로필 이미지 변경 */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          프로필 이미지 변경
        </label>
        <input
          type='file'
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
          className='border border-gray-300 p-2 rounded-md'
        />
        <Button
          text='프로필 이미지 변경'
          className='mt-2'
          onClick={handleProfileImageChange}
        />
      </div>

      {/* 닉네임 변경 */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          닉네임 변경
        </label>
        <input
          type='text'
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          className='border border-gray-300 p-2 rounded-md'
          placeholder='새로운 닉네임 입력'
        />
        <Button
          text='닉네임 변경'
          className='mt-2'
          onClick={handleNicknameChange}
        />
      </div>

      {/* 에러 메시지 */}
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}

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
