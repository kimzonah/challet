import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // Axios instance 가져오기
import useSignUpStore from '../../store/useSignUpStore'; // Zustand 스토어 가져오기

const PhoneCheckPage = () => {
  const [phoneNumber, setPhoneNumber] = useState(''); // 실제 입력된 전화번호
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState(''); // 포맷팅된 전화번호
  const [errorMessage, setErrorMessage] = useState(''); // 중복 검사 결과 메시지
  const [isValid, setIsValid] = useState(false); // 유효성 여부

  const navigate = useNavigate();
  const { setSignUpData } = useSignUpStore(); // Zustand에서 상태 업데이트 함수 가져오기

  // 전화번호 포맷팅 함수 (010-xxxx-xxxx 형식으로 변환)
  const formatPhoneNumber = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, ''); // 숫자 이외의 문자는 제거
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 7)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value.replace(/\D/g, ''))) {
      // 숫자만 허용
      setPhoneNumber(value);
      setFormattedPhoneNumber(formatPhoneNumber(value));
    }
  };

  // 전화번호 중복 검사 함수
  const checkPhoneNumber = async (number: string) => {
    try {
      const response = await axiosInstance.post(
        '/api/challet/auth/check-phone',
        { phoneNumber: number }
      );
      if (response.data.isDuplicate) {
        setErrorMessage('이미 사용중인 전화번호입니다.');
        setIsValid(false);
      } else {
        setErrorMessage('사용 가능한 전화번호입니다.');
        setIsValid(true);
      }
    } catch (error) {
      console.error('중복 검사 오류:', error); // 콘솔에 오류 출력
      setErrorMessage('중복 검사 중 오류가 발생했습니다.');
      setIsValid(false);
    }
  };

  // 11자리 전화번호가 입력되면 자동으로 중복 검사 실행
  useEffect(() => {
    const onlyNumbers = phoneNumber.replace(/\D/g, '');
    if (onlyNumbers.length === 11) {
      checkPhoneNumber(onlyNumbers); // 중복 검사 실행
    } else {
      setErrorMessage('');
      setIsValid(false);
    }
  }, [phoneNumber]);

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (isValid) {
      // 전화번호를 Zustand에 저장
      setSignUpData({ phoneNumber: phoneNumber.replace(/\D/g, '') });
      console.log('전화번호가 저장되었습니다:', phoneNumber.replace(/\D/g, ''));

      // 다음 페이지로 이동
      navigate('/signup');
    }
  };

  return (
    <div>
      <h1>전화번호 중복 검사</h1>
      <div>
        <label>전화번호</label>
        <input
          type='tel' // 전화번호 입력을 위한 타입
          value={formattedPhoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder='010-xxxx-xxxx'
          maxLength={13} // 010-xxxx-xxxx 형식에 맞춘 최대 길이
          inputMode='numeric' // 숫자 전용 키패드를 표시
          pattern='[0-9]*' // 숫자만 입력 가능하도록 제어
        />

        {errorMessage && (
          <p style={{ color: isValid ? 'green' : 'red' }}>{errorMessage}</p>
        )}
      </div>
      <button onClick={handleConfirm} disabled={!isValid}>
        확인
      </button>
    </div>
  );
};

export default PhoneCheckPage;
