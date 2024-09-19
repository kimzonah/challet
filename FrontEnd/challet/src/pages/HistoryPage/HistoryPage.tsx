import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/topbar/topbar'; // TopBar 컴포넌트 import

function HistoryPage() {
  const transactionHistory = [
    {
      date: '9.6',
      time: '22:38',
      description: '교통',
      amount: '-1,000원',
      balance: '303,852',
      isPositive: false,
    },
    {
      date: '9.6',
      time: '21:22',
      description: '용돈이다',
      amount: '+300,000원',
      balance: '304,852',
      isPositive: true,
    },
    {
      date: '9.5',
      time: '6:01',
      description: '교촌치킨',
      amount: '-23,000원',
      balance: '4,852',
      isPositive: false,
    },
  ];

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/history-detail');
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* 상단 바 (TopBar) */}
      <TopBar title='거래 내역' />

      {/* 잔액 표시 */}
      <div className='p-4 mt-16 ml-2 text-left'>
        <p className='text-base text-gray-500'>챌렛계좌</p>
        <h2 className='text-3xl font-semibold'>314,852원</h2>
      </div>

      {/* 거래 내역 검색 필드 */}
      <div className='px-4 py-2'>
        <div className='flex items-center bg-gray-100 rounded-md px-3 py-2'>
          <svg
            className='w-5 h-5 text-gray-400 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-4.35-4.35m-6.65 1.35a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'
            ></path>
          </svg>
          <input
            type='text'
            placeholder='거래 내역 검색'
            className='bg-transparent flex-1 focus:outline-none text-gray-500'
          />
        </div>
      </div>

      {/* 거래 내역 리스트 */}
      <div className='divide-y divide-gray-200'>
        {transactionHistory.map((transaction, index) => (
          <div
            key={index}
            className='px-4 py-4 cursor-pointer' // 클릭 가능한 스타일 추가
            onClick={handleClick} // 클릭 시 handleClick 호출
          >
            {/* 날짜와 시간 */}
            <div className='flex items-center'>
              <p className='text-sm font-semibold text-gray-800 mr-2'>
                {transaction.date}
              </p>
              <p className='mx-2 text-sm font-semibold text-gray-400'>|</p>
              <p className='text-sm font-semibold text-gray-500'>
                {transaction.time}
              </p>
            </div>
            {/* 설명, 금액, 잔액 */}
            <div className='flex justify-between items-start mt-1'>
              <p className='text-base font-semibold text-gray-700'>
                {transaction.description}
              </p>
              <div className='text-right'>
                <p
                  className={`text-base font-semibold ${
                    transaction.isPositive ? 'text-teal-500' : 'text-gray-700'
                  }`}
                >
                  {transaction.amount}
                </p>
                <p className='text-sm font-semibold text-gray-400'>
                  잔액 {transaction.balance}원
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryPage;
