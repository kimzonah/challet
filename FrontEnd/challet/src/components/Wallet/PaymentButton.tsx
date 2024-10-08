import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Keypad from '../../components/Keypad/Keypad';
import PaymentButtonImage from '../../assets/wallet/payment-button.png';
import axiosInstance from '../../api/axiosInstance'; // axios 인스턴스 불러오기

const PaymentButton = () => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false); // 키패드 열림 여부 상태
  const [pin, setPin] = useState(''); // 입력된 비밀번호 상태
  const [loading, setLoading] = useState(false); // 서버 요청 중 로딩 상태
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const [showErrorModal, setShowErrorModal] = useState(false); // 에러 모달 상태
  const navigate = useNavigate();

  // 비밀번호 입력 완료 시 호출되는 함수
  const handlePinComplete = async () => {
    setLoading(true); // 로딩 시작
    setErrorMessage(''); // 오류 메시지 초기화
    try {
      // 서버로 비밀번호 검증 요청
      const response = await axiosInstance.post(
        '/api/ch-bank/simple-password',
        {
          password: pin, // 저장된 비밀번호를 사용
        }
      );

      // 서버에서 성공 응답을 받았을 때
      if (response.status === 200) {
        // 200 응답이면 결제 페이지로 이동
        setIsPinModalOpen(false); // 모달 닫기
        navigate('/payment'); // 결제 페이지로 이동
      }
    } catch (error) {
      setErrorMessage('비밀번호 확인 중 오류가 발생했습니다.');
      setShowErrorModal(true); // 에러 모달 열기
      console.error(error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <>
      <img
        src={PaymentButtonImage}
        alt='Payment Button'
        className='w-full h-auto'
        onClick={() => setIsPinModalOpen(true)} // 결제하기 버튼 클릭 시 키패드 모달 열기
        style={{ cursor: 'pointer' }}
        role='button'
        aria-label='결제하기'
      />

      {/* 키패드 모달 */}
      {isPinModalOpen && (
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50'
          onClick={() => setIsPinModalOpen(false)} // 바깥 영역 클릭 시 모달 닫기
        >
          <div
            className='bg-white p-6 rounded-lg shadow-lg relative'
            onClick={(e) => e.stopPropagation()} // 키패드 영역 클릭 시 모달이 닫히지 않게
          >
            <Keypad
              maxLength={6}
              onPinChange={(enteredPin) => setPin(enteredPin)} // 비밀번호를 상태에 저장
              onComplete={handlePinComplete} // 상태로 저장된 비밀번호를 사용
              showMessage={true} // 메시지 표시
            />
            {loading && <p>로딩 중...</p>} {/* 로딩 표시 */}
          </div>
        </div>
      )}

      {/* 에러 메시지 모달 */}
      {showErrorModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100'>
          <div className='bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto'>
            <p className='text-red-500 text-center'>{errorMessage}</p>
            <button
              className='bg-blue-500 text-white px-4 py-2 mt-4 rounded-md'
              onClick={() => setShowErrorModal(false)} // 모달 닫기
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentButton;
