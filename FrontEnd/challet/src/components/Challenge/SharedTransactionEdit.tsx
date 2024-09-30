import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons'; // 카메라 아이콘 추가
import { useChallengeApi } from '../../hooks/useChallengeApi'; // useChallengeApi 임포트

const SharedTransactionEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { editTransaction } = useChallengeApi(); // 트랜잭션 수정 및 더미 데이터
  const { transaction } = location.state || {}; // SharedTransactionDetail에서 전달된 거래 데이터
  const [image, setImage] = useState<File | null>(null); // 이미지 파일
  const [withdrawal, setWithdrawal] = useState(''); // 출금처
  const [transactionAmount, setTransactionAmount] = useState<number | ''>(''); // 거래 금액
  const [content, setContent] = useState(''); // 내용
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [isSuccess, setIsSuccess] = useState(false); // 성공 여부 상태 관리

  useEffect(() => {
    if (transaction) {
      // 거래 내역에서 전달된 값들로 기본 값을 설정
      setWithdrawal(transaction.withdrawal);
      setTransactionAmount(transaction.transactionAmount);
      setContent(transaction.content);
      setImage(null); // 기본 이미지는 새로 등록하지 않음 (이미지 미리보기를 위한 설정)
    }
  }, [transaction]);

  // 이미지 업로드 처리 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // 첫 번째 파일을 설정
    }
  };

  // 폼 제출 시 처리할 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // JSON 형태로 보낼 데이터 구조 생성
    const formData = {
      image: image ? URL.createObjectURL(image) : transaction.image, // 기존 이미지가 없으면 빈 문자열, 아니면 그대로 사용
      withdrawal, // 출금처
      transactionAmount: Number(transactionAmount), // 거래 금액
      content, // 내용
    };

    try {
      setIsLoading(true); // API 호출 전 로딩 상태로 전환
      // registTransaction API 호출 - 수정된 데이터를 전송
      await editTransaction(transaction.sharedTransactionId, formData); // JSON 데이터를 전달

      // 성공 메시지 설정
      setIsSuccess(true);
    } catch (error) {
      console.error('거래 내역 수정 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // API 응답 후 로딩 상태 해제
    }
  };

  return (
    <div className='min-h-screen bg-white flex justify-center items-center relative'>
      {/* 모달이 로딩 중이거나 성공 시 표시 */}
      {(isLoading || isSuccess) && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg text-center'>
            {isLoading ? (
              <>
                <div className='flex justify-center items-center mb-4'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#00CCCC]'></div>
                </div>
                <p className='text-lg font-semibold'>수정 중입니다...</p>
              </>
            ) : (
              <>
                <p className='text-lg font-semibold text-[#00CCCC]'>
                  수정이 완료되었습니다!
                </p>
                <button
                  className='mt-4 py-2 px-4 bg-[#00CCCC] text-white rounded-lg'
                  onClick={() => navigate(-1)} // 성공 시 이전 페이지로 이동
                >
                  확인
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 탑바 */}
      <div className='fixed top-0 left-0 right-0'>
        <div className='flex justify-between pt-8 px-3 items-center bg-white'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          <p className='text-lg font-semibold'>지출 수정하기</p>
          <button
            className='text-[#00CCCC] font-semibold'
            onClick={handleSubmit}
          >
            수정
          </button>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className='bg-white p-6 rounded-lg w-[90%] mt-6'>
        <form onSubmit={handleSubmit}>
          {/* 이미지 업로드 */}
          <div className='mb-4'>
            <label
              htmlFor='file-upload'
              className='block w-full h-48 bg-[#F1F4F6] rounded-lg flex justify-center items-center cursor-pointer'
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt='이미지 미리보기'
                  className='w-full h-full object-cover rounded-lg'
                />
              ) : transaction.image ? (
                <img
                  src={transaction.image}
                  alt='기존 이미지'
                  className='w-full h-full object-cover rounded-lg'
                />
              ) : (
                <div className='text-center'>
                  <FontAwesomeIcon
                    icon={faCamera}
                    className='text-4xl text-gray-400'
                  />
                  <p className='text-gray-400 mt-2'>사진 등록하기</p>
                </div>
              )}
            </label>
            <input
              id='file-upload'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
          </div>

          {/* 결제 항목 입력 */}
          <div className='mb-4'>
            <label className='flex block text-gray-700 mb-2'>결제 항목</label>
            <input
              type='text'
              className='w-full p-2 border rounded-lg bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC]'
              value={withdrawal}
              maxLength={12}
              placeholder='직접 추가할 항목을 작성해주세요'
              onChange={(e) => setWithdrawal(e.target.value)}
              required
            />
          </div>

          {/* 결제 금액 입력 */}
          <div className='mb-4'>
            <label className='flex block text-gray-700 mb-2'>결제 금액</label>
            <input
              type='number'
              className='w-full p-2 border rounded-lg bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC]'
              value={transactionAmount}
              placeholder='결제한 금액을 입력해주세요'
              max={9999999}
              onChange={(e) => {
                const value = e.target.value;
                // 빈 값 처리 및 마이너스 값 또는 1천만(10,000,000) 이상을 입력하지 않도록 제한
                if (value === '') {
                  setTransactionAmount(''); // 빈 값일 때 null로 설정
                } else if (Number(value) >= 0 && Number(value) <= 9999999) {
                  setTransactionAmount(Number(value));
                }
              }}
              required
            />
          </div>

          {/* 내용 입력 (textarea 사용) */}
          <div className='mb-4'>
            <label className='flex block text-gray-700 mb-2'>결제 내용</label>
            <textarea
              className='w-full p-2 border rounded-lg h-40 resize-none overflow-auto bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-[#00CCCC]'
              value={content}
              placeholder='결제 내용을 작성해주세요'
              maxLength={200}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedTransactionEdit;
