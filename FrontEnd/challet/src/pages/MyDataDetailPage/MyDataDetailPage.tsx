import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TopBar } from '../../components/topbar/topbar';

interface TransactionDetails {
  transactionAmount: number;
  transactionDatetime: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  category: string;
}

function MyDataDetailPage() {
  const location = useLocation();
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.transactionDetails) {
      setTransactionDetails(location.state.transactionDetails);
      setLoading(false);
    } else {
      console.error('거래 상세 내역이 없습니다.');
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  if (!transactionDetails) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg'>거래 내역이 없습니다.</p>
      </div>
    );
  }

  // 날짜 포맷팅
  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}.${month}.${day}. ${hours}:${minutes}`;
  };

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='상세 내역' />

      <div className='p-22 mt-16 text-left'>
        <div className='p-4 text-left ml-2 mb-12'>
          <p className='text-lg font-semibold text-[#00CCCC]'>
            {transactionDetails.transactionAmount > 0
              ? transactionDetails.withdrawal
              : transactionDetails.deposit}
          </p>
          <h2 className='text-3xl font-semibold text-[#373A3F]'>
            {transactionDetails.transactionAmount.toLocaleString()}원
          </h2>
        </div>

        <div className='mx-6 border-t border-b border-gray-300 py-4'>
          <div className='grid grid-cols-2 gap-y-10 gap-x-2 text-base text-[#585962] py-4'>
            <div className='text-left font-medium'>일시</div>
            <div className='text-right font-medium'>
              {formatDate(transactionDetails.transactionDatetime)}
            </div>
            <div className='text-left font-medium'>입금처</div>
            <div className='text-right font-medium'>
              {transactionDetails.deposit}
            </div>
            <div className='text-left font-medium'>카테고리</div>
            <div className='text-right font-medium'>
              {transactionDetails.category}
            </div>
            <div className='text-left font-medium'>출금처</div>
            <div className='text-right font-medium'>
              {transactionDetails.withdrawal}
            </div>
            <div className='text-left font-medium'>거래 후 잔액</div>
            <div className='text-right font-medium'>
              {transactionDetails.transactionBalance.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyDataDetailPage;