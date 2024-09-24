import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useAccountStore from '../../store/useAccountStore';
import AxiosInstance from '../../api/axiosInstance';
import axios from 'axios';

interface Account {
  id: number;
  accountNumber: string;
  accountBalance: number;
}

interface AccountResponse {
  accountCount: number;
  accounts: Account[];
}

const WalletBalanceSection = () => {
  const navigate = useNavigate();
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [status, setStatus] = useState({
    loading: true,
    error: false,
    errorMessage: '',
  });

  const { setAccountInfo: setStoreAccountInfo } = useAccountStore();

  const { accessToken } = useAuthStore();
  // 테스트용 refreshToken
  // const AccessToken =
  // 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMTAxMjM0NTY3OCIsImlhdCI6MTcyNzEzOTcwNSwiZXhwIjoxNzI3NzQ0NTA1LCJ0eXBlIjoicmVmcmVzaF90b2tlbiJ9.030UDcf6ZNCzI3DMZ121lwciYqfaW3B373ntOmgg8v3mtWP4uaPRDzHmA1LILW5BiHEoE7U2-8SqgveLxSksSQ';

  const fetchAccountInfo = useCallback(async () => {
    if (!accessToken) {
      setStatus({
        loading: false,
        error: true,
        errorMessage: '유효하지 않은 토큰입니다.',
      });
      return;
    }

    try {
      console.log(
        `리프레시 토큰으로 계좌 정보를 요청 중입니다: ${accessToken}`
      );

      const response = await AxiosInstance.get<AccountResponse>('/api/ch-bank');

      if (response.data.accounts.length > 0) {
        const account = response.data.accounts[0];
        setAccountInfo(account); // 컴포넌트 상태 업데이트
        setStoreAccountInfo(account); // 스토어 상태 업데이트
        setStatus((prevState) => ({ ...prevState, loading: false }));
      } else {
        setStatus({
          loading: false,
          error: true,
          errorMessage: '계좌 정보가 없습니다.',
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setStatus((prevState) => ({ ...prevState, loading: false }));
    }
  }, [accessToken, setStoreAccountInfo]); // useCallback으로 함수 메모이제이션 및 의존성 배열 추가

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.errorMessage || '알 수 없는 오류가 발생했습니다.';
      console.error('Axios error:', message); // Axios 오류 로그
      setStatus({
        loading: false,
        error: true,
        errorMessage:
          error.response?.status === 400 &&
          error.response?.data?.errorCode === 'NotFoundUserAccountException'
            ? '계좌가 존재하지 않습니다.'
            : `오류: ${message}`,
      });
    } else {
      console.error('Non-Axios error:', error); // 일반 오류 로그
      setStatus({
        loading: false,
        error: true,
        errorMessage: '요청을 보내는 중 오류가 발생했습니다.',
      });
    }
  };

  useEffect(() => {
    console.log('WalletBalanceSection mounted, starting data fetch...'); // 컴포넌트 마운트 시 로그
    fetchAccountInfo(); // useEffect 내에서 메모이제이션된 fetchAccountInfo 호출
  }, [fetchAccountInfo]); // 의존성 배열에 fetchAccountInfo 추가

  if (status.loading) {
    return (
      <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
        <p className='text-xs font-bold mt-2 mb-4'>로딩 중...</p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
        <p className='text-xs font-bold mt-2 mb-4'>{status.errorMessage}</p>
      </div>
    );
  }

  console.log('Rendering account info:', accountInfo); // 렌더링 데이터 로그
  return (
    <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
      <div className='text-left'>
        <h2 className='text-sm font-medium text-[#6C6C6C] mb-4'>
          챌렛계좌 {accountInfo ? ` ${accountInfo.accountNumber}` : ''}
        </h2>
        {accountInfo ? (
          <p className='text-2xl font-bold mt-2 mb-4'>
            {accountInfo.accountBalance.toLocaleString()}원
          </p>
        ) : (
          <h2 className='text-sm font-semibold text-gray-700 mb-4'>
            계좌가 존재하지 않습니다.
          </h2>
        )}
      </div>
      <div className='flex justify-end gap-2'>
        <button
          className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-[#6C6C6C] bg-white'
          onClick={() => {
            navigate('/transfer');
          }}
        >
          송금
        </button>
        <button
          className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-[#6C6C6C] bg-white'
          onClick={() => {
            navigate('/history');
          }}
        >
          내역
        </button>
      </div>
    </div>
  );
};

export default WalletBalanceSection;
