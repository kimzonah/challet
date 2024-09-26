import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse, AxiosError } from 'axios';
import axiosInstance from '../../api/axiosInstance';
import useSignUpStore from '../../store/useSignUpStore';
import useAuthStore from '../../store/useAuthStore'; // 로그인 상태 저장을 위한 Zustand 스토어
import Keypad from '../../components/Keypad/Keypad';

const SetPasswordPage = () => {
  const [password, setPassword] = useState<string>(''); // 비밀번호 상태
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false); // 확인 버튼 활성화 상태
  const { name, phoneNumber, age, gender, nickname } = useSignUpStore(); // 저장된 회원가입 데이터 가져오기
  const { setAuthData } = useAuthStore(); // Zustand에서 상태 관리 함수 가져오기
  const navigate = useNavigate();

  // 비밀번호 입력
  const handleKeyPress = (digit: string) => {
    if (password.length < 6) {
      setPassword((prev) => prev + digit); // 비밀번호 입력 추가
    }
  };

  // 전체 삭제
  const handleClear = () => {
    setPassword('');
  };

  // 한 글자 삭제
  const handleBackspace = () => {
    if (password.length > 0) {
      setPassword((prev) => prev.slice(0, -1));
    }
  };

  // 비밀번호가 6자리가 되면 버튼 활성화
  useEffect(() => {
    setIsButtonEnabled(password.length === 6); // 비밀번호 6자리가 되면 버튼 활성화
  }, [password]);

  // 데이터 전송 및 회원가입 처리
  const handleSubmit = async () => {
    if (password.length === 6) {
      const signUpData = {
        phoneNumber,
        password,
        nickname,
        profileImage: null,
        age,
        gender,
        name,
      };

      // 회원가입 데이터와 비밀번호 콘솔 출력
      console.log('회원가입 정보:', signUpData);

      try {
        // POST 요청을 통해 회원가입 및 비밀번호 설정
        const response: AxiosResponse = await axiosInstance.post(
          '/api/challet/auth/signup',
          signUpData
        );

        // 요청이 성공하면 Access Token을 받아와 상태에 저장
        const { accessToken, userId } = response.data;

        if (accessToken) {
          // Access Token 저장 (로그인 상태 유지)
          setAuthData({
            accessToken,
            userId,
          });

          console.log('Access Token:', accessToken, 'userId', userId);

          // 로그인 후 메인 페이지로 이동
          navigate('/wallet'); // 회원가입 성공 후 메인 페이지로 이동
        } else {
          console.error('Access Token을 받지 못했습니다.');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            '회원가입 및 비밀번호 설정 실패:',
            error.response?.data || error.message
          );
        } else {
          console.error('회원가입 및 비밀번호 설정 실패:', error);
        }
      }
    } else {
      alert('6자리 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div>
      <h1>간편 비밀번호 설정</h1>

      {/* 저장된 회원가입 정보가 유효한지 확인 */}
      {!name || !phoneNumber || !age || gender === null ? (
        <>
          <p style={{ color: 'red' }}>회원가입 정보가 누락되었습니다.</p>
          {/* 누락된 정보 콘솔 출력 */}
          {console.log('회원가입 정보:', {
            name: name || '이름 없음',
            phoneNumber: phoneNumber || '전화번호 없음',
            age: age || '나이 없음',
            gender: gender,
          })}
        </>
      ) : (
        <>
          {/* 비밀번호 입력 점 표시 */}
          <div className='flex justify-center space-x-3 mb-6'>
            {password.split('').map((_, index) => (
              <div
                key={index}
                className='w-4 h-4 bg-gray-800 rounded-full'
              ></div>
            ))}
            {Array(6 - password.length)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className='w-4 h-4 bg-gray-300 rounded-full'
                ></div>
              ))}
          </div>

          {/* 키패드 */}
          <Keypad
            onKeyPress={handleKeyPress}
            onClear={handleClear}
            onBackspace={handleBackspace}
          />
          {/* 비밀번호 제출 버튼 */}
          <button onClick={handleSubmit} disabled={!isButtonEnabled}>
            비밀번호 설정
          </button>
        </>
      )}
    </div>
  );
};
export default SetPasswordPage;
