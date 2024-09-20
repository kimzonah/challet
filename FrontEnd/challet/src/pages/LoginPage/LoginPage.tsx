import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setAuthData } = useAuthStore(); // Zustand에서 상태 관리 함수 가져오기

  const handleLogin = async () => {
    try {
      // 로그인 API 호출
      const { data } = await axiosInstance.post('/challet-service/auth/login', {
        phoneNumber,
        password,
      });

      // 서버 응답에서 Access Token 추출
      const { accessToken } = data;

      // 로그인 시 상태 저장 (Access Token, Refresh Token, 닉네임, 프로필 이미지)
      setAuthData({
        accessToken,
        refreshToken: null, // refreshToken을 나중에 필요할 경우 추가 가능
        nickname: null, // 기본값 설정
        profileImageUrl: null, // 기본값 설정
      });

      // Access Token 출력
      console.log('로그인 성공 - Access Token:', accessToken);

      // 로그인 성공 후 메인 페이지로 이동
      navigate('/wallet');
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage('로그인 정보가 잘못되었습니다.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(); // 로그인 처리 함수 호출
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-center'>로그인</h2>

        <form onSubmit={handleSubmit}>
          {/* 전화번호 입력 필드 */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              전화번호
            </label>
            <input
              type='text'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='전화번호 입력'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              required
              maxLength={11}
              pattern='\d{11}' // 숫자 11자리만 입력 가능
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700'>
              비밀번호
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='비밀번호 입력'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* 오류 메시지 표시 */}
          {errorMessage && (
            <p className='text-red-500 text-sm'>{errorMessage}</p>
          )}

          {/* 로그인 버튼 */}
          <button
            type='submit'
            className='w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
