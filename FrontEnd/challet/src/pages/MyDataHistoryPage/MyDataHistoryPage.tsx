import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';

interface Transaction {
  id: number;
  transactionDate: string;
  deposit: string;
  withdrawal: string;
  transactionBalance: number;
  transactionAmount: number;
}

interface TransactionResponse {
  transactionCount: number;
  accountBalance: number;
  transactionResponseDTO: Transaction[];
}

function MyDataHistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] =
    useState<TransactionResponse | null>(null);

  const { bankShortName, accountNumber } = location.state || {};

  useEffect(() => {
    if (location.state?.transactionData) {
      setTransactionData(location.state.transactionData);
    }
  }, [location.state]);

  if (!transactionData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg'>로딩 중...</p>
      </div>
    );
  }

  const bankEndpoints: Record<string, string> = {
    국민: '/api/kb-bank/details',
    농협: '/api/nh-bank/details',
    신한: '/api/sh-bank/details',
  };

  const handleTransactionClick = async (transactionId: number) => {
    const apiUrl = bankEndpoints[bankShortName];
    if (!apiUrl) {
      console.error('유효하지 않은 은행 정보입니다.');
      return;
    }

    try {
      const response = await axiosInstance.get(apiUrl, {
        headers: {
          TransactionId: transactionId.toString(),
        },
      });

      console.log('거래 상세 내역 응답:', response.data);

      navigate(`/mydata-detail/${transactionId}`, {
        state: { transactionDetails: response.data },
      });
    } catch (error) {
      console.error('거래 내역을 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='거래 내역' />

      {/* 연동된 계좌 정보 표시 */}
      <div className='p-4 mt-16 ml-2 text-left'>
        <p className='text-sm font-medium mb-1 text-[#6C6C6C]'>
          {bankShortName} {accountNumber}
        </p>
        <h2 className='text-3xl font-bold'>
          {transactionData.accountBalance?.toLocaleString()}원
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
      <div className='divide-y divide-gray-200 mb-20'>
        {transactionData.transactionResponseDTO.length > 0 ? (
          transactionData.transactionResponseDTO.map((transaction) => {
            const dateObject = new Date(transaction.transactionDate);
            const date = `${dateObject.getMonth() + 1}.${dateObject.getDate()}`;
            const time = dateObject.toTimeString().slice(0, 5);

            const isDeposit = transaction.transactionAmount > 0;

            return (
              <div
                key={transaction.id}
                className='px-4 py-4 cursor-pointer'
                onClick={() => handleTransactionClick(transaction.id)}
              >
                <div className='flex items-center'>
                  <p className='text-sm font-medium text-gray-800 mr-1'>
                    {date}
                  </p>
                  <p className='mx-2 text-sm font-semibold text-gray-400'>|</p>
                  <p className='text-sm font-medium text-[#6C6C6C]'>{time}</p>
                </div>
                <div className='flex justify-between items-start mt-4'>
                  {/* 거래 종류에 따라 deposit 또는 withdrawal을 표시 */}
                  <p className='text-base font-medium text-[#373A3F]'>
                    {isDeposit ? transaction.deposit : transaction.withdrawal}
                  </p>
                  <div className='text-right'>
                    <p
                      className={`text-base font-medium ${
                        transaction.transactionAmount < 0
                          ? 'text-[#00CCCC]'
                          : 'text-[#373A3F]'
                      }`}
                    >
                      {transaction.transactionAmount < 0
                        ? `${transaction.transactionAmount.toLocaleString()}원`
                        : `+${transaction.transactionAmount.toLocaleString()}원`}
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
}

export default MyDataHistoryPage;