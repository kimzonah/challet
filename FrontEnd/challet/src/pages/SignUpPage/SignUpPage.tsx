import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 페이지 이동 및 데이터 수신을 위해 사용
import axiosInstance from '../../api/axios';
import { AxiosResponse, AxiosError } from 'axios';

const SignUpPage = () => {
  const location = useLocation(); // 이전 페이지에서 전달된 데이터 받기
  const navigate = useNavigate(); // 페이지 이동을 위해 사용

  const [name, setName] = useState(''); // 이름 입력 상태
  const [idNumberFront, setIdNumberFront] = useState(''); // 주민등록번호 앞자리
  const [idNumberBackFirst, setIdNumberBackFirst] = useState(''); // 주민등록번호 뒷자리 첫 숫자
  const [phoneNumber, setPhoneNumber] = useState(
    location.state?.phoneNumber || ''
  ); // 전화번호 상태 (인증된 번호가 있으면 자동 입력)
  const [isFormValid, setIsFormValid] = useState(false); // 회원가입 버튼 활성화 여부

  // 나이 계산 함수 (주민번호 앞자리로 계산)
  const calculateAge = (idFront: string): number => {
    const birthYear = parseInt(idFront.slice(0, 2), 10);
    const currentYear = new Date().getFullYear();
    const yearPrefix = birthYear <= currentYear % 100 ? 2000 : 1900;
    return currentYear - (yearPrefix + birthYear);
  };

  // 성별 판별 함수 (주민번호 뒷자리 첫 숫자로 판별)
  const determineGender = (idBackFirst: string): number => {
    if (idBackFirst === '1' || idBackFirst === '3') {
      return 0; // 남성 (0)
    } else if (idBackFirst === '2' || idBackFirst === '4') {
      return 1; // 여성 (1)
    }
    return -1; // 잘못된 값일 경우 (에러 처리 가능)
  };

  // 모든 필드가 올바르게 입력되었는지 확인하는 함수
  useEffect(() => {
    // 모든 필드가 입력되었고, 전화번호는 11자리여야 함
    if (
      name &&
      idNumberFront.length === 6 &&
      idNumberBackFirst.length === 1 &&
      phoneNumber.length === 11
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, idNumberFront, idNumberBackFirst, phoneNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const age = calculateAge(idNumberFront); // 나이 계산
    const gender = determineGender(idNumberBackFirst); // 성별 판별 (0: 남성, 1: 여성)

    // 성별 판별이 실패한 경우 (gender가 -1일 경우)
    if (gender === -1) {
      alert('잘못된 주민등록번호 뒷자리입니다.');
      return;
    }

    // 전송 데이터
    const userData = {
      name,
      phone_number: phoneNumber,
      age,
      GENDER: gender, // 성별 (남자: 0, 여자: 1)
    };

    // axios POST 요청
    axiosInstance
      .post('/challet-service/users', userData)
      .then((response: AxiosResponse) => {
        if (response.status === 201) {
          console.log('회원가입이 완료되었습니다!');
          navigate('/set-password'); // 성공 시 비밀번호 설정 페이지로 이동
        }
      })
      .catch((error: AxiosError<{ message: string }>) => {
        const errorMessage =
          error.response?.data?.message || '회원가입에 실패했습니다.';
        console.error(errorMessage); // 에러 메시지 콘솔 출력
      });
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        {/* 이름 입력 */}
        <div>
          <label>이름</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='이름'
            required
          />
        </div>

        {/* 주민등록번호 입력 필드 */}
        <div>
          <label>주민등록번호</label>
          <div>
            <input
              type='text'
              value={idNumberFront}
              onChange={(e) => setIdNumberFront(e.target.value)}
              placeholder='앞자리 (예: 990101)'
              maxLength={6}
              required
            />
            <span>-</span>
            <input
              type='text'
              value={idNumberBackFirst}
              onChange={(e) => setIdNumberBackFirst(e.target.value)}
              placeholder='뒷자리 첫 숫자'
              maxLength={1}
              required
            />
            <span>●●●●●●</span>
          </div>
        </div>

        {/* 전화번호 필드: 인증된 번호가 자동으로 입력됨 */}
        <div>
          <label>전화번호</label>
          <input
            type='text'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder='전화번호'
            maxLength={11} // 최대 11자리
            pattern='\d{11}' // 정확히 11자리 숫자만 허용
            required
          />
        </div>

        {/* 확인 버튼 */}
        <button type='submit' disabled={!isFormValid}>
          확인
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
