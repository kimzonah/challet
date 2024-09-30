import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCamera } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘
import useFile2URL from '../../hooks/useFile2URL'; // useFile2URL 임포트
import webSocketService from '../../hooks/websocket'; // 웹소켓 서비스 임포트

const SharedTransactionCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {}; // ChallengeRoom에서 전달된 id 가져오기
  const { file2URL } = useFile2URL(); // AWS S3 업로드 함수 사용

  const [image, setImage] = useState<File | null>(null); // 이미지 파일
  const [withdrawal, setWithdrawal] = useState(''); // 출금처
  const [transactionAmount, setTransactionAmount] = useState<number | ''>(''); // 거래 금액
  const [content, setContent] = useState(''); // 내용
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [isSuccess, setIsSuccess] = useState(false); // 성공 여부 상태 관리
  const [isError, setIsError] = useState(false); // 에러 모달 상태 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 관리

  // 이미지 업로드 처리 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // 첫 번째 파일을 설정
    }
  };

  // 폼 제출 시 처리할 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 결제 항목 및 결제 금액 필수 값 체크
    if (!withdrawal || transactionAmount === '') {
      setErrorMessage('결제 항목과 결제 금액은 빈칸이 될 수 없습니다.');
      setIsError(true); // 에러 모달 표시
      return; // 필수 값이 없을 경우 처리 중단
    }

    try {
      setIsLoading(true); // API 호출 전 로딩 상태로 전환

      let imageUrl = '';
      if (image) {
        // 이미지가 있는 경우 AWS S3에 업로드하고 URL을 반환받음
        imageUrl = await file2URL(image);
      }

      // 웹소켓을 통해 서버로 데이터 전송
      const webSocketMessage = {
        action: 'ADD', // DTO에서 요구하는 ActionType
        image: imageUrl, // 업로드된 이미지 URL
        withdrawal, // 출금처
        transactionAmount: Number(transactionAmount), // 거래 금액
        content, // 결제 내용
      };

      webSocketService.sendMessage(
        `/app/challenges/${id}/shared-transactions`,
        webSocketMessage
      );

      // 성공 메시지 설정
      setIsSuccess(true);
    } catch (error) {
      console.error('거래 내역 등록 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // API 응답 후 로딩 상태 해제
    }
  };

  return (
    <div className='min-h-screen bg-white flex justify-center items-center relative'>
      {/* 모달이 로딩 중이거나 성공 시 표시 */}
      {(isLoading || isSuccess || isError) && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg text-center'>
            {isLoading ? (
              <>
                <div className='flex justify-center items-center mb-4'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#00CCCC]'></div>
                </div>
                <p className='text-lg font-semibold'>업로드 중입니다...</p>
              </>
            ) : isSuccess ? (
              <>
                <p className='text-lg font-semibold text-[#00CCCC]'>
                  등록이 완료되었습니다!
                </p>
                <button
                  className='mt-4 py-2 px-4 bg-[#00CCCC] text-white rounded-lg'
                  onClick={() => navigate(-1)} // 성공 시 이전 페이지로 이동
                >
                  확인
                </button>
              </>
            ) : (
              isError && (
                <>
                  <p className='text-lg font-semibold text-red-500'>
                    {errorMessage}
                  </p>
                  <button
                    className='mt-4 py-2 px-4 bg-red-500 text-white rounded-lg'
                    onClick={() => setIsError(false)} // 에러 모달 닫기
                  >
                    확인
                  </button>
                </>
              )
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
              value={transactionAmount === null ? '' : transactionAmount}
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
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedTransactionCreate;
