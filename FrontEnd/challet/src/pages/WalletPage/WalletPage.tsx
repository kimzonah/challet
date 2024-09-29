import { useEffect, useState } from 'react';
import ChalletLogo from '../../assets/wallet/challet-logo.png';
import MyDataConnectButton from '../../components/Wallet/MyDataConnectButton';
import WalletBalanceSection from '../../components/Wallet/WalletBalanceSection';
import PaymentButton from '../../components/Wallet/PaymentButton';
import ConnectedMyData from '../../components/Wallet/ConnectedMyData';
import axiosInstance from '../../api/axiosInstance';
import { AxiosError } from 'axios';

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/ch-bank/mydatas');
        setWalletData(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 401) {
            setError(err.response.data.errorMessage);
          } else {
            setError('An error occurred while fetching data.');
          }
        } else {
          setError('An unknown error occurred.');
        }
      }
    };

    fetchData();
  }, []);

  // 분리된 렌더링 로직
  const renderMyDataSection = () => {
    if (walletData) {
      // 데이터가 있을 때 ConnectedMyData를 렌더링
      return <ConnectedMyData data={walletData} />;
    }

    if (error) {
      // 에러가 있을 때 MyDataConnectButton을 렌더링
      return <MyDataConnectButton />;
    }

    // 로딩 상태를 표시하거나 다른 상태를 처리할 수 있습니다.
    return null;
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center p-6 mt-12'>
      <div className='w-full flex flex-col items-center mb-8'>
        <div className='w-full flex justify-start'>
          <img
            src={ChalletLogo}
            alt='Challet Logo'
            className='w-28 h-auto ml-2 mt-10 mb-12'
          />
        </div>
        <PaymentButton />
      </div>

      {/* WalletBalanceSection은 계속 존재 */}
      <WalletBalanceSection />

      {/* MyData 섹션 렌더링 */}
      {renderMyDataSection()}
    </div>
  );
};

export default WalletPage;
