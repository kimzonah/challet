import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const SetPasswordPage = () => {
  const [password, setPassword] = useState<string>(''); // 비밀번호 상태
  const navigate = useNavigate();

  // 키패드를 클릭할 때 비밀번호 입력
  const handleKeyPress = (digit: string) => {
    if (password.length < 6) {
      setPassword((prev) => prev + digit); // 비밀번호 입력 추가
    }
  };

  // 비밀번호 제출
  const handleSubmit = () => {
    if (password.length === 6) {
      axiosInstance
        .post('/challet-service/users/set-password', { password }) // 서버에 비밀번호 전송
        .then((response) => {
          if (response.status === 200) {
            console.log('비밀번호 설정이 완료되었습니다!');
            navigate('/success'); // 성공 페이지로 이동
          }
        })
        .catch((error) => {
          console.error('비밀번호 설정에 실패했습니다.', error);
        });
    } else {
      alert('6자리 비밀번호를 입력해주세요.');
    }
  };

  // 가상 키패드
  const renderKeypad = () => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    return digits.map((digit) => (
      <button key={digit} onClick={() => handleKeyPress(digit)}>
        {digit}
      </button>
    ));
  };

  return (
    <div>
      <h1>간편 비밀번호 설정</h1>

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
      <button onClick={handleSubmit} disabled={password.length !== 6}>
        비밀번호 설정
      </button>
    </div>
  );
};

export default SetPasswordPage;
