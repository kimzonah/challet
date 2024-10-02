import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faPencilAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'; // 무료 아이콘 사용
import { AxiosError } from 'axios';
import useFile2URL from '../../hooks/useFile2URL';
import useAuthStore from '../../store/useAuthStore';
import axiosInstance from '../../api/axiosInstance';
import NicknameModal from './NicknameModal';
import defaultProfileImage from '../../assets/mypage/default-profile.png';

const MyPage = () => {
  const navigate = useNavigate();
  const { file2URL } = useFile2URL();
  const { clearAuthData } = useAuthStore();
  const [nickname, setNickname] = useState(''); // API 응답에서 닉네임 설정
  const [profileImageUrl, setProfileImageUrl] = useState(''); // API 응답에서 프로필 이미지 설정
  // const [accountNumber, setAccountNumber] = useState('110-123-456789'); // 계좌번호는 하드코딩
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  // 로그인한 유저 정보 조회 API 호출
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/challet/users');
      setNickname(response.data.nickname || ''); // 닉네임 상태에 저장
      setProfileImageUrl(response.data.profileImage || defaultProfileImage); // 프로필 이미지 URL 상태에 저장, 없으면 기본 이미지 사용
      // setAccountNumber(response.data.accountNumber || ''); // 계좌번호 응답
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
    fetchUserData(); // 컴포넌트 마운트 시 데이터 설정
  }, [fetchUserData]);

  // 프로필 이미지 수정 API 요청
  const handleProfileImageChange = async (image: File) => {
    if (!image) return;

    try {
      const urlImage = await file2URL(image);

      const response = await axiosInstance.patch(
        '/api/challet/users/profileImages',
        {
          profileImage: urlImage,
        }
      );

      console.log('프로필 이미지 수정 성공:', response.data);
      alert('프로필 이미지가 수정되었습니다.');
      setProfileImageUrl(urlImage);
    } catch (error) {
      console.error('프로필 이미지 수정 실패:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleProfileImageChange(file);
    }
  };

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
    setIsNicknameModalOpen(false);
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  // 각각의 버튼 클릭 시 이동할 페이지 처리
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className='min-h-screen bg-white p-4'>
      <div className='flex items-end justify-between'>
        {/* 프로필 이미지 */}
        <div className='relative'>
          <img
            src={profileImageUrl || defaultProfileImage}
            alt='프로필 이미지'
            className='w-24 h-24 rounded-full'
            onClick={() => document.getElementById('fileInput')?.click()} // 프로필 이미지 클릭 시 파일 입력 열기
          />

          {/* 카메라 아이콘 (프로필 이미지 오른쪽 하단에 배치) */}
          <div className='absolute bottom-0 right-0 w-8 h-8 bg-white p-1 rounded-full border border-gray-400 flex items-center justify-center'>
            <FontAwesomeIcon
              icon={faCamera}
              className='text-gray-600 w-4 h-4 cursor-pointer'
              onClick={() => document.getElementById('fileInput')?.click()}
            />
          </div>

          <input
            id='fileInput'
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>

        {/* 로그아웃 버튼 (오른쪽 끝에 배치) */}
        <div className='flex items-end'>
          <button className='text-lg flex items-center' onClick={handleLogout}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className='text-gray-600 w-5 h-5 mr-1'
            />
            로그아웃
          </button>
        </div>
      </div>

      {/* 사용자 정보 (닉네임과 수정 아이콘, 계좌번호) */}
      <div className='mt-4'>
        <div className='flex items-center'>
          <h2 className='font-semibold text-xl'>{nickname}</h2>
          <FontAwesomeIcon
            icon={faPencilAlt}
            className='text-gray-600 ml-2 cursor-pointer'
            onClick={() => setIsNicknameModalOpen(true)}
          />
        </div>
        {/* <p className='text-gray-500 text-left'>{accountNumber}</p> */}
      </div>

      {/* 네 개의 아이템을 한 줄에 한 개씩 배치 */}
      <div className='grid grid-cols-1 gap-4 mt-6'>
        <div
          className='bg-red-100 rounded-lg p-4 relative'
          onClick={() => handleNavigate('/wallet')}
          style={{
            backgroundImage: 'url(/path-to-your-image.jpg)',
            backgroundSize: 'cover',
          }} // 배경 이미지 설정
        >
          <h2 className='text-white font-bold text-lg text-left'>
            지갑을 관리하고 결제 및 마이데이터를 연동하세요
          </h2>
          <p className='text-white text-sm mt-2 text-left'>
            결제 내역을 쉽게 확인하고, 마이데이터 연동으로 금융 데이터를 자동
            관리하세요.
          </p>

          {/* 오른쪽 하단에 배치되는 버튼 */}
          <button className='bg-white text-red-500 font-bold py-2 px-4 rounded-full absolute bottom-0 right-0 m-4'>
            지갑 보기
          </button>
        </div>

        <div
          className='bg-orange-100 rounded-lg p-4 relative'
          onClick={() => handleNavigate('/challenge')}
          style={{
            backgroundImage: 'url(/path-to-your-image.jpg)',
            backgroundSize: 'cover',
          }}
        >
          <h2 className='text-white font-bold text-lg text-left'>
            챌린지에 참여해 소비 목표를 설정하고 습관을 개선하세요
          </h2>
          <p className='text-white text-sm mt-2 text-left'>
            거래 내역을 공유하고, 더 나은 소비 습관을 위한 목표를 설정하세요.
          </p>

          {/* 오른쪽 하단에 배치되는 버튼 */}
          <button className='bg-white text-orange-500 font-bold py-2 px-4 rounded-full absolute bottom-0 right-0 m-4'>
            챌린지 참여하기
          </button>
        </div>

        <div
          className='bg-yellow-100 rounded-lg p-4 relative'
          onClick={() => handleNavigate('/analysis')}
          style={{
            backgroundImage: 'url(/path-to-your-image.jpg)',
            backgroundSize: 'cover',
          }}
        >
          <h2 className='text-white font-bold text-lg text-left'>
            소비 패턴을 분석하고 다른 사용자와 비교해 보세요
          </h2>
          <p className='text-white text-sm mt-2 text-left'>
            내 소비 내역을 분석하고, 비슷한 소비 습관을 가진 사용자들과 비교할
            수 있습니다.
          </p>

          {/* 오른쪽 하단에 배치되는 버튼 */}
          <button className='bg-white text-yellow-500 font-bold py-2 px-4 rounded-full absolute bottom-0 right-0 m-4'>
            소비 분석 보기
          </button>
        </div>

        <div
          className='bg-green-100 rounded-lg p-4 relative'
          onClick={() => handleNavigate('/rewards')}
          style={{
            backgroundImage: 'url(/path-to-your-image.jpg)',
            backgroundSize: 'cover',
          }}
        >
          <h2 className='text-white font-bold text-lg text-left'>
            챌린지 리워드를 확인하고 활용하세요
          </h2>
          <p className='text-white text-sm mt-2 text-left'>
            완료한 챌린지에서 얻은 리워드를 확인하고 관리하세요.
          </p>

          {/* 오른쪽 하단에 배치되는 버튼 */}
          <button className='bg-white text-green-500 font-bold py-2 px-4 rounded-full absolute bottom-0 right-0 m-4'>
            리워드 확인하기
          </button>
        </div>
      </div>

      {/* 닉네임 수정 모달 */}
      {isNicknameModalOpen && (
        <NicknameModal
          onNicknameChange={handleNicknameChange}
          onClose={() => setIsNicknameModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyPage;
