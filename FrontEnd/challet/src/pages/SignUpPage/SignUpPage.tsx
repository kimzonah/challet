import { useState } from 'react';
import axios from 'axios'; // axios를 임포트하여 사용
import { useNavigate } from 'react-router-dom'; // 페이지 이동에 필요
import { AxiosResponse } from 'axios'; // AxiosResponse 타입을 가져옴

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [idNumberFront, setIdNumberFront] = useState(''); // 주민등록번호 앞자리 (6자리)
  const [idNumberBackFirst, setIdNumberBackFirst] = useState(''); // 주민등록번호 뒷자리 첫 번째 숫자
  const navigate = useNavigate(); // 비밀번호 설정 페이지로 이동할 때 사용

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 성별 판단: 1, 3은 남성 / 2, 4는 여성
    let gender = '';
    if (idNumberBackFirst === '1' || idNumberBackFirst === '3') {
      gender = 'male';
    } else if (idNumberBackFirst === '2' || idNumberBackFirst === '4') {
      gender = 'female';
    } else {
      alert('잘못된 주민등록번호 뒷자리입니다.');
      return;
    }

    // axios POST 요청 (then-catch 사용)
    axios
      .post('/challet-service/users', {
        name,
        idNumber: `${idNumberFront}-${idNumberBackFirst}******`, // 주민등록번호 (마스킹된 부분)
        gender,
      })
      .then((response: AxiosResponse) => {
        // 성공 처리
        if (response.status === 201) {
          console.log('회원가입이 완료되었습니다!');
          navigate('/set-password'); // 성공 시 비밀번호 설정 페이지로 이동
        }
      })
      .catch((error: any) => {
        // 오류 처리
        const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
        console.error(errorMessage); // 에러 메시지를 콘솔에 출력
      });

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

        {/* 주민등록번호 입력 (앞자리 + 뒷자리 첫 번째 숫자) */}
        <div>
          <label>주민등록번호</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 앞자리 입력 */}
            <input
              type='text'
              value={idNumberFront}
              onChange={(e) => setIdNumberFront(e.target.value)}
              placeholder='앞자리 (예: 990101)'
              maxLength={6} // 앞자리 6자리로 제한
              required
            />

            <span style={{ marginLeft: '10px' }}>-</span>

            {/* 뒷자리 첫 번째 숫자 입력 */}
            <input
              type='text'
              value={idNumberBackFirst}
              onChange={(e) => setIdNumberBackFirst(e.target.value)}
              placeholder='뒷자리 첫 숫자'
              maxLength={1} // 뒷자리 첫 번째 숫자만 입력 가능
              style={{ width: '20px', textAlign: 'center', marginLeft: '10px' }}
              required
            />

            {/* 마스킹 처리된 나머지 부분 */}
            <span style={{ marginLeft: '10px' }}>●●●●●●</span>
          </div>
        </div>

        {/* 확인 버튼 */}
        <button type='submit'>확인</button>
      </form>
    </div>
  );
};

export default SignUpPage;