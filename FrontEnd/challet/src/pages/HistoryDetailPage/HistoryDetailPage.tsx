import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import chBankAxiosInstance from '../../api/chBankAxios';
import { TopBar } from '../../components/topbar/topbar';

interface TransactionDetail {
  transactionAmount: number;
  transactionDatetime: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  category: string;
}

const HistoryDetailPage = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transactionDetail, setTransactionDetail] =
    useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      if (!transactionId) return;

      try {
        const response = await chBankAxiosInstance.get<TransactionDetail>(
          `/details`,
          {
            headers: { TransactionId: transactionId },
          }
        );

        setTransactionDetail(response.data);
      } catch (error: unknown) {
        console.error('Failed to fetch transaction detail:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId]);

  if (loading) {
    return; /* From Uiverse.io by carlosepcc */
    <div
      class='loader border-t-2 rounded-full border-yellow-500 bg-yellow-300 animate-spin
    aspect-square w-8 flex justify-center items-center text-yellow-700'
    >
      $
    </div>;
  }

  if (error || !transactionDetail) {
    return <p>거래 내역 상세 정보를 불러오는 데 문제가 발생했습니다.</p>;
  }

  // 날짜와 시간을 포맷팅하는 함수
  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}.${month}.${day}. ${hours}:${minutes}`;
  };

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='상세 내역' />

      {/* 거래 내역 정보 */}
      <div className='p-4 mt-20 text-left ml-2 mb-12'>
        <p className='text-base text-gray-500'>{transactionDetail.deposit}</p>
        <h2
          className={`text-3xl font-semibold ${transactionDetail.transactionAmount < 0 ? 'text-gray-800' : 'text-gray-800'}`}
        >
          -{Math.abs(transactionDetail.transactionAmount).toLocaleString()}원
        </h2>
      </div>

      {/* 상세 정보 카드 */}
      <div className='p-4 mx-6 bg-white rounded-lg min-h-[350px] flex flex-col justify-center'>
        <div className='grid grid-cols-2 gap-y-10 gap-x-2 text-sm text-gray-600'>
          <div className='text-left font-semibold'>일시</div>
          <div className='text-right font-semibold'>
            {formatDate(transactionDetail.transactionDatetime)}{' '}
            {/* 날짜와 시간을 포맷팅하여 표시 */}
          </div>
          <div className='text-left font-semibold'>입금처</div>
          <div className='text-right font-semibold'>
            {transactionDetail.deposit}
          </div>
          <div className='text-left font-semibold'>카테고리</div>
          <div className='text-right font-semibold'>
            {transactionDetail.category}
          </div>
          <div className='text-left font-semibold'>출금처</div>
          <div className='text-right font-semibold'>
            {transactionDetail.withdrawal}
          </div>
          <div className='text-left font-semibold'>거래 후 잔액</div>
          <div className='text-right font-semibold'>
            {transactionDetail.transactionBalance.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailPage;
