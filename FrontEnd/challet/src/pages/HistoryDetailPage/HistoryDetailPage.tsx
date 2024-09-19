import { TopBar } from '../../components/topbar/topbar'; // TopBar 컴포넌트 import

function HistoryDetailPage() {
  // 예시 데이터 (서버로부터 받아온 데이터라고 가정)
  const transactionDetail = {
    title: '교촌치킨',
    amount: '-23,000원',
    date: '2024년 9월 8일 13:20',
    from: '교촌치킨',
    category: '식비',
    to: '내 챌릿계좌번호',
    balanceAfter: '4,852원',
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* 상단 바 (TopBar) */}
      <TopBar title='상세 내역' />

      {/* 거래 내역 정보 */}
      <div className='p-4 mt-20 text-left ml-2 mb-12'>
        <p className='text-base text-gray-500'>{transactionDetail.title}</p>
        <h2
          className={`text-3xl font-semibold ${
            transactionDetail.amount.startsWith('-')
              ? 'text-gray-800'
              : 'text-teal-500'
          }`}
        >
          {transactionDetail.amount}
        </h2>
      </div>

      {/* 상세 정보 카드 */}
      <div className='p-4 mx-4 my-6 bg-gray-100 rounded-lg'>
        {' '}
        <div className='grid grid-cols-2 gap-y-10 text-sm text-gray-600'>
          {' '}
          <div className='text-left font-semibold'>일시</div>
          <div className='text-right font-semibold'>
            {transactionDetail.date}
          </div>{' '}
          <div className='text-left font-semibold'>입금처</div>
          <div className='text-right font-semibold'>
            {transactionDetail.from}
          </div>{' '}
          <div className='text-left font-semibold'>카테고리</div>
          <div className='text-right font-semibold'>
            {transactionDetail.category}
          </div>{' '}
          <div className='text-left font-semibold'>출금처</div>
          <div className='text-right font-semibold'>
            {transactionDetail.to}
          </div>{' '}
          <div className='text-left font-semibold'>거래 후 잔액</div>
          <div className='text-right font-semibold'>
            {transactionDetail.balanceAfter}
          </div>{' '}
        </div>
      </div>
    </div>
  );
}

export default HistoryDetailPage;
