import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import { TopBar } from '../../components/topbar/topbar';

interface Transaction {
  id: number;
  transactionDate: string;
  deposit: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionResponse {
  transactionCount: number;
  accountBalance: number;
  transactionResponseDTO: Transaction[];
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const { accountInfo } = useAccountStore(); // 스토어에서 accountInfo 가져오기
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!accountInfo) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await AxiosInstance.get<TransactionResponse>(
          `api/ch-bank/accounts`,
          {
            headers: { AccountId: accountInfo.id.toString() },
          }
        );

        console.log('Transaction history:', response.data);
        setTransactionHistory(response.data.transactionResponseDTO);
      } catch (error: unknown) {
        console.error('Failed to fetch transaction history:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [accountInfo]);

  const handleTransactionClick = (transactionId: number) => {
    // 거래내역 항목 클릭 시 해당 ID를 URL 파라미터로 전달하여 상세조회 페이지로 이동
    navigate(`/history-detail/${transactionId}`);
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>거래 내역을 불러오는 데 문제가 발생했습니다.</p>;
  }

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='거래 내역' />

      {/* 잔액 표시 */}
      <div className='p-4 mt-16 ml-2 text-left'>
        <p className='text-sm font-medium text-[#6C6C6C]'>챌렛계좌</p>
        <h2 className='text-3xl font-bold'>
          {accountInfo
            ? `${accountInfo.accountBalance.toLocaleString()}원`
            : '잔액 정보 없음'}
        </h2>
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
        {transactionHistory.length > 0 ? (
          transactionHistory.map((transaction) => {
            const dateObject = new Date(transaction.transactionDate);
            const date = `${dateObject.getMonth() + 1}.${dateObject.getDate()}`;
            const time = dateObject.toTimeString().slice(0, 5);

            return (
              <div
                key={transaction.id}
                className='px-4 py-4 cursor-pointer'
                onClick={() => handleTransactionClick(transaction.id)} // 클릭 시 상세 페이지로 이동
              >
                <div className='flex items-center'>
                  {' '}
                  <p className='text-sm font-medium text-gray-800 mr-1'>
                    {date}
                  </p>
                  <p className='mx-2 text-sm font-semibold text-gray-400'>|</p>
                  <p className='text-sm font-medium text-[#6C6C6C]'>{time}</p>
                </div>
                <div className='flex justify-between items-start mt-4'>
                  {' '}
                  <p className='text-base font-medium text-[#373A3F]'>
                    {transaction.deposit}
                  </p>
                  <div className='text-right'>
                    <p className='text-base font-medium text-[#373A3F]'>
                      -{transaction.transactionAmount.toLocaleString()}원
                    </p>
                    <p className='text-sm font-medium text-[#6C6C6C]'>
                      잔액 {transaction.transactionBalance.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-center text-gray-500 py-4'>
            거래 내역이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
