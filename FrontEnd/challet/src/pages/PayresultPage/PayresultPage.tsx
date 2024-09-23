import { useLocation } from 'react-router-dom'; // useLocation import

const PayResult = () => {
  const location = useLocation(); // 현재 location 정보를 가져옴
  const { qrData } = location.state || {}; // 전달된 state에서 qrData 추출

  // qrData가 JSON 형식일 경우 파싱
  let parsedData;
  try {
    parsedData = qrData ? JSON.parse(qrData) : null;
  } catch (error) {
    console.error('Error parsing QR data:', error);
  }

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-between p-4 relative'>
      {/* 중앙 정렬을 위한 컨테이너 */}
      <div className='flex flex-col items-center justify-center flex-grow w-full'>
        {/* 상단 결제 완료 아이콘 및 텍스트 */}
        <div className='flex flex-col items-center mt-16'>
          <div className='w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              ></path>
            </svg>
          </div>
          <h2 className='text-xl text-[#373A3F] font-bold mt-6 mb-24'>
            결제완료
          </h2>
        </div>

        {/* 결제 내역 */}
        {parsedData ? (
          <div className='w-full mb-8 flex flex-col items-center'>
            {/* 결제 내역 상단 선 */}
            <div className='w-full border-t border-gray-200'></div>
            <div className='w-4/5 flex justify-between py-4'>
              <p className=' text-[#585962] font-medium'>결제내역</p>
              <p className='text-[#585962] font-medium'>{parsedData.name}</p>
            </div>
            <div className='w-4/5 flex justify-between py-4'>
              <p className='text-[#585962] font-medium'>카테고리</p>
              <p className='text-[#585962] font-medium'>
                {parsedData.category}
              </p>
            </div>
            <div className='w-4/5 flex justify-between py-4'>
              <p className='text-[#585962] font-medium'>결제 금액</p>
              <p className='text-[#585962] font-medium'>
                {parsedData.amount}원
              </p>
            </div>
            {/* 결제 내역 하단 선 */}
            <div className='w-full border-b border-gray-300'></div>
          </div>
        ) : (
          <p className='text-[#585962] text-xs mt-4 text-center'>
            No QR data found.
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      <button
        onClick={() => console.log('결제 확인')}
        className='fixed bottom-0 left-0 right-0 w-full py-5 bg-[#00CCCC] text-white font-medium text-lg'
      >
        확인
      </button>
    </div>
  );
};

export default PayResult;
