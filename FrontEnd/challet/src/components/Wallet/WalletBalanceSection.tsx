import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AccountInfo {
  id: number;
  accountNumber: string;
  accountBalance: string;
}

const WalletBalanceSection: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null); // 계좌 정보를 저장할 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태를 관리
  const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태

  useEffect(() => {
    // API 호출 함수
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get('/bank-service/challet-banks/');
        setAccountInfo(response.data);
        setLoading(false);
      } catch (error: any) {
        setError('계좌 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchAccountInfo(); // 컴포넌트가 마운트될 때 API 호출
  }, []);

  if (loading) {
    return <p>로딩 중...</p>; // 로딩 중일 때
  }

  if (error) {
    return <p className='text-red-500'>{error}</p>; // 에러 발생 시 에러 메시지 표시
  }

  return (
    <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
      {/* 챌릿계좌 제목과 잔액 */}
      <div className='text-left'>
        <h2 className='text-sm font-medium text-gray-500 mb-4'>
          챌렛계좌 {accountInfo ? ` ${accountInfo.accountNumber} pp` : ''}
        </h2>
        {accountInfo ? (
          <>
            <p className='text-2xl font-bold mt-2 mb-4'>
              {accountInfo.accountBalance}원
            </p>
          </>
        ) : (
          <p>계좌 정보를 불러올 수 없습니다.</p>
        )}
      </div>

      {/* 버튼 섹션 */}
      <div className='flex justify-end gap-2'>
        <button
          className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-500 bg-white'
          onClick={() => navigate('/transfer')}
        >
          송금
        </button>
        <button
          className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-500 bg-white'
          onClick={() => navigate('/history')}
        >
          내역
        </button>
      </div>
    </div>
  );
};

export default WalletBalanceSection;
