import { useState } from 'react';

const PhoneAuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // 사용자 입력한 전화번호 처리 함수
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setPhoneNumber(input);

    // 입력된 전화번호가 11자리면 확인 버튼 활성화, 그렇지 않으면 비활성화
    if (input.length === 11) {
      setIsButtonDisabled(false); // 11자리면 버튼 활성화
    } else {
      setIsButtonDisabled(true); // 11자리가 아니면 버튼 비활성화
    }
  };

  // 사용자가 확인 버튼을 눌렀을 때 호출되는 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 서버로 전화번호를 전송하거나 인증 처리 로직 추가

    console.log(`인증 요청 전화번호: ${phoneNumber}`); // 콘솔에 전화번호 출력
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>휴대폰 번호를 입력해주세요</h1>
      <p>본인 인증을 위해 필요합니다</p>

      <form onSubmit={handleSubmit}>
        <div style={{ margin: '20px 0' }}>
          <input
            type='text'
            value={phoneNumber} // 입력된 전화번호 상태 연결
            onChange={handlePhoneNumberChange} // 입력 시 호출되는 함수
            placeholder='전화번호 입력 (숫자만 입력)'
            maxLength={11}
          />
        </div>

        {/* 확인 버튼 */}
        <button
          type='submit' // 폼 제출 시 호출됨
          disabled={isButtonDisabled} // 버튼 비활성화 여부 결정
        >
          확인
        </button>
      </form>
    </div>
  );
};

export default PhoneAuthPage;
