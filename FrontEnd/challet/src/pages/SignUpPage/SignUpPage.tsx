import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRandomNickname } from '@woowa-babble/random-nickname'; // 랜덤 닉네임 생성기 임포트
import useSignUpStore from '../../store/useSignUpStore';
import Button from '../../components/Button/Button'; // Button 컴포넌트 임포트

const SignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setSignUpData } = useSignUpStore();
  const [name, setName] = useState(''); // 이름 입력 상태
  const [idNumberFront, setIdNumberFront] = useState(''); // 주민등록번호 앞자리
  const [idNumberBackFirst, setIdNumberBackFirst] = useState(''); // 주민등록번호 뒷자리 첫 숫자
  const [phoneNumber, setPhoneNumber] = useState(
    location.state?.phoneNumber || ''
  ); // 전화번호 상태
  const [nickname, setNickname] = useState(''); // 랜덤 닉네임 상태
  const [isFormValid, setIsFormValid] = useState(false); // 회원가입 버튼 활성화 여부
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const [showIdInput, setShowIdInput] = useState(false); // 주민등록번호 입력 필드 표시 상태

  // Input 필드 참조
  const idNumberFrontRef = useRef<HTMLInputElement>(null);
  const idNumberBackFirstRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  // 나이 계산 함수 (주민번호 앞자리로 계산)
  const calculateAge = (idFront: string): number => {
    const birthYear = parseInt(idFront.slice(0, 2), 10);
    const currentYear = new Date().getFullYear();
    const yearPrefix = birthYear <= currentYear % 100 ? 2000 : 1900;
    return currentYear - (yearPrefix + birthYear);
  };

  // 성별 판별 함수 ('0' 또는 '1' 반환)
  const determineGender = (idBackFirst: string): number | null => {
    if (['1', '3'].includes(idBackFirst)) return 0; // 남성
    if (['2', '4'].includes(idBackFirst)) return 1; // 여성
    return null; // 오류 처리
  };

  // 폼 유효성 검사
  useEffect(() => {
    setIsFormValid(
      name.length > 0 &&
        idNumberFront.length === 6 &&
        idNumberBackFirst.length === 1 &&
        phoneNumber.length === 11
    );

    if (
      !name ||
      idNumberFront.length !== 6 ||
      idNumberBackFirst.length !== 1 ||
      phoneNumber.length !== 11
    ) {
      setErrorMessage(''); // 입력값이 다 채워지지 않으면 에러 메시지 초기화
    }
  }, [name, idNumberFront, idNumberBackFirst, phoneNumber]);

  // 랜덤 닉네임 생성
  useEffect(() => {
    const generatedNickname = getRandomNickname('animals'); // animals, heroes, characters, monsters 중 선택 가능
    setNickname(generatedNickname);
  }, []);

  // 이름 입력 핸들러
  const handleNameSubmit = () => {
    if (name.length > 0) {
      setShowIdInput(true); // 이름 입력 후 주민등록번호 입력 필드 표시
    }
  };

  // 폼 제출 및 상태 저장
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = calculateAge(idNumberFront);
    const gender = determineGender(idNumberBackFirst);
    if (gender == null) {
      alert('잘못된 주민등록번호 뒷자리입니다.');
      return;
    }
    const signUpData = { phoneNumber, nickname, age, gender, name };
    setSignUpData(signUpData);
    navigate('/set-password');
  };

  return (
    <div className='min-h-screen flex flex-col justify-center px-6'>
      <form onSubmit={handleSubmit}>
        {/* 주민등록번호 입력 필드 */}
        {showIdInput ? (
          <>
            <div className='mb-6'>
              <label className='block text-lg font-bold text-gray-700'>
                주민등록번호
              </label>
              <div className='flex items-center'>
                <input
                  type='text'
                  value={idNumberFront}
                  onChange={(e) => setIdNumberFront(e.target.value)}
                  placeholder='앞자리 (예: 990101)'
                  maxLength={6}
                  required
                  className='border border-gray-300 rounded-md py-2 px-3 mr-2 w-24'
                  ref={idNumberFrontRef}
                />
                <span>-</span>
                <input
                  type='text'
                  value={idNumberBackFirst}
                  onChange={(e) => setIdNumberBackFirst(e.target.value)}
                  placeholder='뒷자리 첫 숫자'
                  maxLength={1}
                  required
                  className='border border-gray-300 rounded-md py-2 px-3 ml-2 w-16'
                  ref={idNumberBackFirstRef}
                />
                <span className='ml-2'>●●●●●●</span>
              </div>
            </div>

            <div className='mb-6'>
              <label className='block text-lg font-bold text-gray-700'>
                전화번호
              </label>
              <input
                type='text'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='전화번호를 입력하세요'
                maxLength={11}
                required
                className='border border-gray-300 rounded-md py-2 px-3 w-full'
                ref={phoneNumberRef}
              />
            </div>

            <Button text='가입 완료' disabled={!isFormValid} />
          </>
        ) : (
          <>
            <div className='mb-6'>
              <label className='block text-lg font-bold text-gray-700'>
                이름
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='이름을 입력하세요'
                required
                className='border border-gray-300 rounded-md py-2 px-3 w-full'
              />
              <Button
                text='확인'
                onClick={handleNameSubmit}
                disabled={name.length === 0}
              />
            </div>
          </>
        )}

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SignUpPage;
