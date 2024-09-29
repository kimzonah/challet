import React from 'react';
import { useNavigate } from 'react-router-dom';
import shLogo from '../../assets/mydata/sh-logo.png';
import kbLogo from '../../assets/mydata/kb-logo.png';
import nhLogo from '../../assets/mydata/nh-logo.png';

type Account = {
  id: number | string;
  accountNumber: string;
  accountBalance: number;
};

type BankData = {
  accountCount: number;
  accounts: Account[];
};

type ConnectedMyDataProps = {
  data: {
    kbBanks?: BankData;
    nhBanks?: BankData;
    shBanks?: BankData;
  };
};

// 은행 로고와 짧은 이름을 저장한 객체
type BankKey = 'sh' | 'kb' | 'nh';

const bankDetails: Record<BankKey, { shortName: string; logo: string }> = {
  sh: { shortName: '신한', logo: shLogo },
  kb: { shortName: '국민', logo: kbLogo },
  nh: { shortName: '농협', logo: nhLogo },
};

const ConnectedMyData: React.FC<ConnectedMyDataProps> = ({ data }) => {
  const navigate = useNavigate();

  // 각 은행별 데이터를 처리하여 계좌 정보를 표시
  const renderBankAccounts = (bankKey: BankKey, bankData: BankData) => (
    <div key={bankKey}>
      {bankData.accounts.map((account) => (
        <div
          key={account.id}
          className='p-4 bg-white w-full  flex justify-between items-center'
        >
          {/* 로고는 왼쪽에 */}
          <div className='flex-shrink-0'>
            <img
              src={bankDetails[bankKey].logo}
              alt={`${bankDetails[bankKey].shortName} 로고`}
              className={`${bankKey === 'nh' ? 'w-6 h-8 ml-1 mr-5' : 'w-8 h-8 mr-4'}`}
            />
          </div>

          {/* 계좌 번호와 금액을 왼쪽 정렬 */}
          <div className='flex flex-col text-left'>
            {/* 은행 이름과 계좌 번호 */}
            <p className='text-sm text-[#6C6C6C]'>
              {bankDetails[bankKey].shortName} {account.accountNumber}
            </p>

            {/* 금액은 은행 이름과 계좌 번호 밑에 */}
            <p className='text-lg font-semibold text-[#373A3F]'>
              {account.accountBalance.toLocaleString()}원
            </p>
          </div>

          {/* 송금 버튼은 오른쪽 끝에 */}
          <div className='ml-auto'>
            <button
              className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-[#6C6C6C] bg-white'
              onClick={() => navigate('/transfer')}
            >
              송금
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className='connected-mydata-section'
      style={{ width: '97%' }} // 너비를 회색 div와 동일하게 설정
    >
      {/* 회색 구분선을 추가하고 제목을 왼쪽 정렬 */}
      <div className='border-t border-gray-200'>
        <h2 className='text-base font-medium mt-4 mb-4 text-left'>
          마이데이터 연동 계좌
        </h2>
      </div>

      {/* 모든 계좌 정보를 하나의 큰 div 안에 넣음 */}
      <div className='bg-white mb-24' style={{ width: '100%' }}>
        {data.kbBanks && renderBankAccounts('kb', data.kbBanks)}
        {data.nhBanks && renderBankAccounts('nh', data.nhBanks)}
        {data.shBanks && renderBankAccounts('sh', data.shBanks)}

        {/* 계좌가 없을 때 */}
        {!data.kbBanks && !data.nhBanks && !data.shBanks && (
          <p className='text-sm text-[#6C6C6C]'>연결된 계좌가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectedMyData;
