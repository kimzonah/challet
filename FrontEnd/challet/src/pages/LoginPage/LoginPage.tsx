import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../store/useAuthStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [enteredDigits, setEnteredDigits] = useState(''); // 키패드로 입력한 숫자 상태
  const [errorMessage, setErrorMessage] = useState('');
  const { setAuthData } = useAuthStore(); // Zustand에서 상태 관리 함수 가져오기

  // 키패드 입력 핸들러
  const handleDigitPress = (digit: string) => {
    if (enteredDigits.length < 6) {
      setEnteredDigits((prev) => prev + digit); // 숫자 추가
    }
  };

  // 숫자 지우기 핸들러
  const handleBackspace = () => {
    setEnteredDigits((prev) => prev.slice(0, -1)); // 마지막 숫자 제거
  };

  const handleLogin = async () => {
    try {
      // 로그인 API 호출
      const { data } = await AxiosInstance.post('api/challet/auth/login', {
        phoneNumber,
        password: enteredDigits, // 키패드로 입력된 비밀번호 사용
      });

      // 서버 응답에서 Access Token 추출
      const { accessToken, id } = data;

      // 로그인 시 상태 저장
      setAuthData({
        accessToken,
        id,
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

          {/* 비밀번호 입력 필드 (비밀번호 대신 키패드로 입력) */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              간편 비밀번호 입력
            </label>
            <div className='flex justify-center space-x-2'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className='w-8 h-8 border-b-2 border-gray-500 text-center'
                >
                  {enteredDigits[index] ? '●' : ''}
                </div>
              ))}
            </div>
          </div>

          {/* 키패드 */}
          <div className='grid grid-cols-3 gap-2'>
            {[...Array(9).keys()].map((num) => (
              <button
                key={num + 1}
                type='button'
                className='p-4 text-xl bg-gray-100 rounded'
                onClick={() => handleDigitPress((num + 1).toString())}
              >
                {num + 1}
              </button>
            ))}
            <button
              type='button'
              className='p-4 text-xl bg-gray-100 rounded'
              onClick={handleBackspace}
            >
              지우기
            </button>
            <button
              type='button'
              className='p-4 text-xl bg-gray-100 rounded'
              onClick={() => handleDigitPress('0')}
            >
              0
            </button>
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
