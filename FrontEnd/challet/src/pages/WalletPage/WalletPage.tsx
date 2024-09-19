import React from 'react';
import ChalletLogo from '../../assets/wallet/challet-logo.png';
import MyDataConnectButton from '../../components/Wallet/MyDataConnectButton';
import WalletBalanceSection from '../../components/Wallet/WalletBalanceSection';
import PaymentButton from '../../components/Wallet/PaymentButton'; // PaymentButton 컴포넌트 추가

const WalletPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-white flex flex-col items-center p-6 mt-12'>
      {/* Header */}
      <div className='w-full flex flex-col items-center mb-8'>
        {/* 로고 이미지 */}
        <div className='w-full flex justify-start'>
          <img
            src={ChalletLogo}
            alt='Challet Logo'
            className='w-28 h-auto ml-2 mt-10 mb-12'
          />
        </div>
        <PaymentButton />
      </div>
      <WalletBalanceSection />
      <MyDataConnectButton />
    </div>
  );
};

export default WalletPage;
