import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../api/axiosInstance'; // Axios instance 가져오기
// import useSignUpStore from '../../store/useSignUpStore'; // Zustand 상태 관리

const SignUpInfoPage = () => {
  const [name, setName] = useState(''); // 이름 상태
  const [isNameValid, setIsNameValid] = useState(false); // 이름 유효성 체크
  const [showIdInput, setShowIdInput] = useState(false); // 주민등록번호 입력창 표시 여부
  const [idNumberFront, setIdNumberFront] = useState(''); // 주민등록번호 앞자리
  const [idNumberBackFirst, setIdNumberBackFirst] = useState(''); // 주민등록번호 뒷자리 첫 번째 숫자

  // 이름 입력 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setIsNameValid(value.length >= 2); // 이름이 2글자 이상일 때 확인 버튼 표시
  };

  // 확인 버튼 클릭 시 주민번호 입력창 표시 및 이름 입력창 비활성화
  const handleConfirmName = () => {
    if (isNameValid) {
      setShowIdInput(true); // 주민번호 입력창을 표시
    }
  };

  // 주민등록번호 앞자리 입력 핸들러
  const handleIdNumberFrontChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setIdNumberFront(value); // 6자리 숫자만 허용
    }
  };

  // 주민등록번호 뒷자리 첫 번째 숫자 입력 핸들러
  const handleIdNumberBackFirstChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d{0,1}$/.test(value)) {
      setIdNumberBackFirst(value); // 1자리 숫자만 허용
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>휴대폰 인증</h1>
      <h2>휴대폰으로 인증해 주세요</h2>

      {/* 이름 입력 필드 */}
      <div
        style={{
          transition: 'transform 0.5s',
          transform: showIdInput ? 'translateY(200px)' : 'none',
        }}
      >
        <label>이름</label>
        <input
          type='text'
          value={name}
          onChange={handleNameChange}
          placeholder='이름 입력'
          style={{
            display: 'block',
            marginBottom: '10px',
            padding: '10px',
            width: '100%',
          }}
        />
      </div>

      {/* 확인 버튼 */}
      {!showIdInput && isNameValid && (
        <button
          onClick={handleConfirmName}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          확인
        </button>
      )}

      {/* 주민번호 입력 필드 */}
      {showIdInput && (
        <div
          style={{
            transition: 'opacity 0.5s, transform 0.5s', // opacity와 함께 transform도 적용
            opacity: showIdInput ? 1 : 0,
            height: showIdInput ? 'auto' : '0',
            overflow: 'hidden', // 숨겨졌을 때 공간 차지 안 함
          }}
        >
          <label>주민등록번호</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='text'
              value={idNumberFront}
              onChange={handleIdNumberFrontChange}
              placeholder='앞자리 6자리'
              maxLength={6}
              style={{ padding: '10px', width: '60%' }}
            />
            <span style={{ margin: '0 10px' }}>-</span>
            <input
              type='text'
              value={idNumberBackFirst}
              onChange={handleIdNumberBackFirstChange}
              placeholder='뒷자리 첫 숫자'
              maxLength={1}
              style={{ padding: '10px', width: '30%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpInfoPage;
