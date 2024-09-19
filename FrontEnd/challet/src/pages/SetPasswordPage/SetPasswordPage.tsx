import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse, AxiosError } from 'axios';
import axiosInstance from '../../api/axios';
import useSignUpStore from '../../store/useSignUpStore';
import useAuthStore from '../../store/useAuthStore'; // 로그인 상태 저장을 위한 Zustand 스토어

const SetPasswordPage = () => {
  const [password, setPassword] = useState<string>(''); // 비밀번호 상태
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false); // 확인 버튼 활성화 상태
  const { name, phoneNumber, age, gender, nickname } = useSignUpStore(); // 저장된 회원가입 데이터 가져오기
  const { setAuthData } = useAuthStore(); // Zustand에서 상태 관리 함수 가져오기
  const navigate = useNavigate();

  // 키패드를 클릭할 때 비밀번호 입력
  const handleKeyPress = (digit: string) => {
    if (password.length < 6) {
      setPassword((prev) => prev + digit); // 비밀번호 입력 추가
    }
  };

  // 비밀번호가 6자리가 되면 버튼 활성화
  useEffect(() => {
    setIsButtonEnabled(password.length === 6); // 비밀번호 6자리가 되면 버튼 활성화
  }, [password]);

  // 비밀번호 지우기
  const handleBackspace = () => {
    if (password.length > 0) {
      setPassword((prev) => prev.slice(0, -1)); // 마지막 숫자 지우기
    }
  };

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
          '/challet-service/auth/signup',
          signUpData
        );

        // 요청이 성공하면 Access Token을 받아와 상태에 저장
        const { accessToken } = response.data; // 서버에서 Access Token을 반환받는다고 가정

        if (accessToken) {
          // Access Token 저장 (로그인 상태 유지)
          setAuthData({
            accessToken,
            refreshToken: null, // 필요에 따라 refreshToken도 처리
          });

          console.log(
            '회원가입 및 비밀번호 설정 완료 - Access Token:',
            accessToken
          );

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

  // 가상 키패드
  const renderKeypad = () => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    return (
      <div>
        {digits.map((digit) => (
          <button key={digit} onClick={() => handleKeyPress(digit)}>
            {digit}
          </button>
        ))}
        <button onClick={handleBackspace}>지우기</button>{' '}
        {/* 지우기 버튼 추가 */}
      </div>
    );
  };

  return (
    <div>
      <h1>간편 비밀번호 설정</h1>

      {/* 저장된 회원가입 정보가 유효한지 확인 */}
      {!name || !phoneNumber || !age || !gender ? (
        <p style={{ color: 'red' }}>회원가입 정보가 누락되었습니다.</p>
      ) : (
        <>
          {/* 입력된 비밀번호 표시 */}
          <div>
            {password
              .split('')
              .map(() => '●')
              .join('')}{' '}
            {/* 비밀번호는 ●로 마스킹 */}
          </div>

          {/* 키패드 */}
          <div>{renderKeypad()}</div>

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
