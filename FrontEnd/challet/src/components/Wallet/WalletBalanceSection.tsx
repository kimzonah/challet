import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import useAignUpStore from '../../store/useSignUpStore';
import useAccountStore from '../../store/useAccountStore';
import chBankAxiosInstance from '../../api/chBankAxios'; // 커스텀 Axios 인스턴스 import

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { setAccountInfo: setStoreAccountInfo } = useAccountStore();

  // const { phoneNumber } = useSignUpStore(); //useSignUpStore 사용
  const phoneNumber = '01047474747'; // 테스트용 전화번호

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        console.log(`Requesting account info with phoneNumber: ${phoneNumber}`);
        const response = await chBankAxiosInstance.get<AccountResponse>('', {
          params: { phoneNumber }, // 쿼리 파라미터로 phoneNumber 전달
        });

        console.log('Response data:', response.data);

        if (response.data.accounts.length > 0) {
          const account = response.data.accounts[0];
          setAccountInfo(account); // 컴포넌트 상태 업데이트
          setStoreAccountInfo(account); // 스토어 상태 업데이트
          console.log('Account data set in store:', account);
        } else {
          setError(true);
          console.warn('No account data available in response.');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('API Error:', error.message);
        } else {
          console.error('Unknown error occurred.');
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [phoneNumber, setStoreAccountInfo]);

  if (loading) {
    <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
      <p className='text-xs font-bold mt-2 mb-4'>로딩 중..</p>
    </div>;
  }

  if (error) {
    return (
      <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
        <p className='text-xs font-bold mt-2 mb-4'>
          계좌 정보를 불러오는 데 문제가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
      <div className='text-left'>
        <h2 className='text-sm font-medium text-gray-500 mb-4'>
          챌렛계좌 {accountInfo ? ` ${accountInfo.accountNumber}` : ''}
        </h2>
        {accountInfo ? (
          <>
            <p className='text-2xl font-bold mt-2 mb-4'>
              {accountInfo.accountBalance.toLocaleString()}원
            </p>
          </>
        ) : (
          <h2 className='text-sm font-semibold text-gray-700 mb-4'>
            계좌가 없습니다.
          </h2>
        )}
      </div>
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
