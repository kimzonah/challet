import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons'; // 카메라 아이콘 추가
import { useChallengeApi } from '../../hooks/useChallengeApi'; // useChallengeApi 임포트

const SharedTransactionCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {}; // ChallengeRoom에서 전달된 id 가져오기
  const { registTransaction } = useChallengeApi(); // useChallengeApi에서 registTransaction 메소드 사용

  const [image, setImage] = useState<File | null>(null); // 이미지 파일
  const [withdrawal, setWithdrawal] = useState(''); // 출금처
  const [transactionAmount, setTransactionAmount] = useState<number | ''>(''); // 거래 금액
  const [content, setContent] = useState(''); // 내용
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [isSuccess, setIsSuccess] = useState(false); // 성공 여부 상태 관리

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
      image: image ? URL.createObjectURL(image) : '', // 이미지가 없으면 빈 문자열
      withdrawal, // 출금처
      transactionAmount: Number(transactionAmount), // 거래 금액
      content, // 내용
    };

    try {
      setIsLoading(true); // API 호출 전 로딩 상태로 전환
      // registTransaction API 호출
      await registTransaction(id, formData); // JSON 데이터를 전달

      // 성공 메시지 설정
      setIsSuccess(true);
    } catch (error) {
      console.error('거래 내역 등록 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // API 응답 후 로딩 상태 해제
      // 성공 여부에 따른 추가 처리 가능
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
                  <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500'></div>
                </div>
                <p className='text-lg font-semibold'>업로드 중입니다...</p>
              </>
            ) : (
              <>
                <p className='text-lg font-semibold text-teal-500'>
                  등록이 완료되었습니다!
                </p>
                <button
                  className='mt-4 py-2 px-4 bg-teal-500 text-white rounded-lg'
                  onClick={() => navigate(-1)} // 성공 시 이전 페이지로 이동
                >
                  확인
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 탑바 변경을 위해 다시 만듦 */}
      <div className='fixed top-0 left-0 right-0'>
        <div className='flex justify-between pt-8 px-3 items-center bg-white'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          <p className='text-lg font-semibold'>지출 추가하기</p>
          <button
            className='text-[#00CCCC] font-semibold'
            onClick={handleSubmit}
          >
            완료
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
              className='w-full p-2 border rounded-lg bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500'
              value={withdrawal}
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
              className='w-full p-2 border rounded-lg bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500'
              value={transactionAmount}
              placeholder='결제한 금액을 입력해주세요'
              onChange={(e) => setTransactionAmount(Number(e.target.value))}
              required
            />
          </div>

          {/* 내용 입력 (textarea 사용) */}
          <div className='mb-4'>
            <label className='flex block text-gray-700 mb-2'>결제 내용</label>
            <textarea
              className='w-full p-2 border rounded-lg h-40 resize-none overflow-auto bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500'
              value={content}
              placeholder='결제 내용을 작성해주세요'
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedTransactionCreate;
