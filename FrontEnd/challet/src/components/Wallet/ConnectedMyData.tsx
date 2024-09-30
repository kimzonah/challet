import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAccountStore from '../../store/useAccountStore'; // Zustand 스토어 가져오기
import shLogo from '../../assets/mydata/sh-logo.png';
import kbLogo from '../../assets/mydata/kb-logo.png';
import nhLogo from '../../assets/mydata/nh-logo.png';

// Account 타입 정의
type Account = {
  id: number | string;
  accountNumber: string;
  accountBalance: number;
};

// BankData 타입 정의
type BankData = {
  accountCount: number;
  accounts: Account[];
};

// ConnectedMyDataProps 타입 정의
type ConnectedMyDataProps = {
  data: {
    kbBanks?: BankData;
    nhBanks?: BankData;
    shBanks?: BankData;
  };
};

// 은행별 로고와 짧은 이름을 저장하는 타입 정의
type BankKey = 'sh' | 'kb' | 'nh';

const bankDetails: Record<BankKey, { shortName: string; logo: string }> = {
  sh: { shortName: '신한', logo: shLogo },
  kb: { shortName: '국민', logo: kbLogo },
  nh: { shortName: '농협', logo: nhLogo },
};

const ConnectedMyData: React.FC<ConnectedMyDataProps> = ({ data }) => {
  const navigate = useNavigate();
  const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

  // API 엔드포인트 맵핑
  const apiEndpoints: Record<BankKey, string> = {
    nh: '/api/nh-bank/account',
    kb: '/api/kb-bank/account',
    sh: '/api/sh-bank/account',
  };

  // 계좌 클릭 시 스토어에 저장 및 API 호출 후 이동
  const handleAccountClick = async (bankKey: BankKey, account: Account) => {
    setAccountInfo({
      id: account.id,
      accountNumber: account.accountNumber,
      accountBalance: account.accountBalance,
    });

    try {
      const apiUrl = apiEndpoints[bankKey];
      const response = await axios.get(apiUrl, {
        headers: { AccountId: account.id },
      });

      navigate('/mydata-history', {
        state: { transactionData: response.data },
      });
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  // 각 은행별 계좌 정보를 렌더링
  const renderBankAccounts = (bankKey: BankKey, bankData: BankData) => (
    <div key={bankKey}>
      {bankData.accounts.map((account) => (
        <div
          key={account.id}
          className='p-4 bg-white w-full flex justify-between items-center cursor-pointer'
          onClick={() => handleAccountClick(bankKey, account)}
        >
          <div className='flex-shrink-0'>
            <img
              src={bankDetails[bankKey].logo}
              alt={`${bankDetails[bankKey].shortName} 로고`}
              className={`${bankKey === 'nh' ? 'w-6 h-8 ml-1 mr-5' : 'w-8 h-8 mr-4'}`}
            />
          </div>
          <div className='flex flex-col text-left'>
            <p className='text-sm text-[#6C6C6C]'>
              {bankDetails[bankKey].shortName} {account.accountNumber}
            </p>
            <p className='text-lg font-semibold text-[#373A3F]'>
              {account.accountBalance.toLocaleString()}원
            </p>
          </div>
          <div className='ml-auto'>
            <button
              className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-[#6C6C6C] bg-white'
              onClick={(e) => {
                e.stopPropagation(); // 부모의 클릭 이벤트 방지
                navigate('/transfer');
              }}
            >
              송금
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className='connected-mydata-section' style={{ width: '97%' }}>
      <div className='border-t border-gray-200'>
        <h2 className='text-base font-medium mt-4 mb-4 text-left'>
          마이데이터 연동 계좌
        </h2>
      </div>
      <div className='bg-white mb-24' style={{ width: '100%' }}>
        {data.kbBanks && renderBankAccounts('kb', data.kbBanks)}
        {data.nhBanks && renderBankAccounts('nh', data.nhBanks)}
        {data.shBanks && renderBankAccounts('sh', data.shBanks)}
        {!data.kbBanks && !data.nhBanks && !data.shBanks && (
          <p className='text-sm text-[#6C6C6C]'>연결된 계좌가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectedMyData;
