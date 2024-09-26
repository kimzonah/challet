import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { TopBar } from '../../components/topbar/topbar';
import shLogo from '../../assets/mydata/sh-logo.png';
import kbLogo from '../../assets/mydata/kb-logo.png';
import nhLogo from '../../assets/mydata/nh-logo.png';

type AgreementType = {
  serviceAgreement: boolean;
  financialTransaction: boolean;
  personalInfoUsage: boolean;
  withdrawalConsent: boolean;
  thirdPartyInfo: boolean;
};

type Account = {
  id: number;
  accountNumber: string;
  accountBalance: number;
};

type BankResponse = {
  kbBanks: null | { accountCount: number; accounts: Account[] };
  nhBanks: null | { accountCount: number; accounts: Account[] };
  shBanks: null | { accountCount: number; accounts: Account[] };
};

const bankDetails = [
  { key: 'sh', name: '신한은행', code: '8085', logo: shLogo },
  { key: 'kb', name: '국민은행', code: '8083', logo: kbLogo },
  { key: 'nh', name: '농협은행', code: '8084', logo: nhLogo },
];

const MyDataSelectPage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [agreements, setAgreements] = useState<AgreementType>({
    serviceAgreement: false,
    financialTransaction: false,
    personalInfoUsage: false,
    withdrawalConsent: false,
    thirdPartyInfo: false,
  });
  const [allChecked, setAllChecked] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<Record<string, boolean>>({
    sh: false,
    kb: false,
    nh: false,
  });
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]); // 연결된 계좌 정보를 저장할 상태
  const [connectionComplete, setConnectionComplete] = useState(false); // 계좌 연결 완료 상태

  // 전체 동의 상태 변경
  const handleAllChecked = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setAgreements((prevState) => ({
      ...prevState,
      serviceAgreement: newState,
      financialTransaction: newState,
      personalInfoUsage: newState,
      withdrawalConsent: newState,
      thirdPartyInfo: newState,
    }));
  };

  // 개별 동의 항목 상태 변경
  const handleIndividualCheck = (key: keyof AgreementType) => {
    setAgreements((prevState) => {
      const updatedAgreements = { ...prevState, [key]: !prevState[key] };
      setAllChecked(Object.values(updatedAgreements).every((value) => value));
      return updatedAgreements;
    });
  };

  // 은행 선택 상태 변경
  const handleBankSelect = (bankKey: string) => {
    setSelectedBanks((prevState) => ({
      ...prevState,
      [bankKey]: !prevState[bankKey],
    }));
  };

  // 선택된 은행 데이터를 생성
  const getSelectedBanksPayload = () => {
    return bankDetails.map(({ key, code }) => ({
      bankCode: code,
      isSelected: selectedBanks[key],
    }));
  };

  // 은행 연결 API 호출 함수
  const connectToBanks = async () => {
    const payload = { selectedBanks: getSelectedBanksPayload() };
    console.log('Payload to send:', JSON.stringify(payload, null, 2));

    try {
      const response = await axiosInstance.post<BankResponse>(
        '/api/ch-bank/mydata-connect',
        payload
      );
      console.log('Server Response:', response.data);

      // 연결된 계좌 정보를 상태로 저장
      const allAccounts = [
        ...(response.data.kbBanks?.accounts || []),
        ...(response.data.nhBanks?.accounts || []),
        ...(response.data.shBanks?.accounts || []),
      ];

      setConnectedAccounts(allAccounts); // 연결된 계좌 정보를 저장
      setConnectionComplete(true); // 연결 완료 상태로 설정
    } catch (error) {
      console.error('Failed to connect to banks:', error);
    }
  };

  // 한 가지 이상의 은행이 선택되었는지 확인
  const isAnySelected = Object.values(selectedBanks).some((value) => value);

  // 확인 버튼 클릭 시 API 호출
  const handleConfirmClick = () => {
    if (isAnySelected) {
      connectToBanks();
    }
  };

  const handleModalClose = () => {
    if (allChecked) setIsModalOpen(false);
  };

  const getAgreementLabel = (key: keyof AgreementType) => {
    const labels: Record<keyof AgreementType, string> = {
      serviceAgreement: '오픈뱅킹 서비스 동의(필수)',
      financialTransaction: '오픈뱅킹 금융거래제공동의(필수)',
      personalInfoUsage: '오픈뱅킹 개인정보 수집이용제공 동의(필수)',
      withdrawalConsent: '오픈뱅킹 출금/조회 동의(필수)',
      thirdPartyInfo: '출금 이체를 위한 개인정보 제3자제공동의(필수)',
    };
    return labels[key];
  };

  // 은행 코드와 연결된 로고를 반환하는 함수
  const getBankLogo = (accountNumber: string) => {
    const bankCode = accountNumber.slice(0, 4);
    const bank = bankDetails.find((detail) => detail.code === bankCode);
    return bank ? bank.logo : undefined;
  };

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='' />

      <div className='mt-20 p-4 text-left'>
        <h2 className='text-xl text-[#373A3F]'>
          {connectionComplete
            ? '계좌가 성공적으로 연결됐습니다.'
            : '연결할 계좌'}
          <br />
          <span className='font-bold'>
            {connectionComplete ? '' : '한번에 찾기'}
          </span>
        </h2>
        <p className='text-sm text-[#373A3F] mt-2 mb-24'>
          {connectionComplete
            ? '연결된 계좌 정보를 확인하세요.'
            : '계좌를 연결할 은행을 선택해주세요.'}
        </p>

        {/* 연결된 계좌 정보 표시 */}
        {connectionComplete ? (
          <div className='space-y-4 mb-40'>
            {' '}
            {/* 하단 여백 추가 */}
            {connectedAccounts.length > 0 ? (
              connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className='flex items-center p-4 bg-gray-100 rounded-lg'
                >
                  <div className='flex items-center mr-4'>
                    <img
                      src={getBankLogo(account.accountNumber)}
                      alt='은행 로고'
                      className='w-6 h-6'
                    />
                  </div>
                  <div>
                    <p className='text-sm text-[#6C6C6C]'>
                      계좌번호: {account.accountNumber}
                    </p>
                    <p className='text-lg font-semibold text-[#373A3F]'>
                      잔액: {account.accountBalance.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-[#6C6C6C]'>연결된 계좌가 없습니다.</p>
            )}
          </div>
        ) : (
          <div className='mt-8 space-y-4'>
            {bankDetails.map(({ key, name, logo }) => (
              <div
                key={key}
                className='p-6 flex justify-between items-center bg-gray-100 rounded-lg cursor-pointer'
                onClick={() => handleBankSelect(key)}
              >
                <div className='flex items-center'>
                  <img src={logo} alt={name} className='w-8 h-8 mr-3' />
                  <span className='text-[#585962] font-medium'>{name}</span>
                </div>
                <span
                  className={`w-7 h-7 flex justify-center items-center ${
                    selectedBanks[key] ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8]'
                  } text-white rounded-full`}
                >
                  ✔
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 확인 버튼 */}
      <button
        onClick={() => {
          if (connectionComplete) {
            navigate('/wallet');
          } else {
            handleConfirmClick();
          }
        }}
        className={`fixed bottom-0 left-0 right-0 w-full py-5 ${
          isAnySelected || connectionComplete
            ? 'bg-[#00CCCC]'
            : 'bg-[#C8C8C8] cursor-not-allowed'
        } text-white font-medium text-lg`}
        disabled={!isAnySelected && !connectionComplete}
      >
        {connectionComplete ? '확인' : '연결하기'}
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50'>
          <div className='bg-white rounded-t-3xl w-full pb-20 relative'>
            <div className=' p-6'>
              <div className='flex justify-center items-center mb-6'>
                <h2 className='text-lg font-medium text-[#373A3F]'>
                  오픈뱅킹 이용동의
                </h2>
                <button
                  onClick={() => navigate('/wallet')} // 페이지 이동
                  className='absolute right-6 top-6 text-[#373A3F] text-xl font-medium bg-white'
                >
                  ×
                </button>
              </div>
              {/* 전체 동의 */}
              <div
                className='flex items-center mb-4 cursor-pointer'
                onClick={handleAllChecked}
              >
                <span
                  className={`w-7 h-7 flex justify-center items-center ${
                    allChecked ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8]'
                  } text-white rounded-full mr-3 ml-[-7px]`}
                >
                  ✔
                </span>
                <label className='text-base font-semibold text-[#373A3F]'>
                  전체 동의
                </label>
              </div>
              {/* 개별 동의 항목 */}
              <ul className='space-y-3 text-gray-700'>
                {Object.keys(agreements).map((key) => (
                  <li
                    key={key}
                    className='flex items-center cursor-pointer'
                    onClick={() =>
                      handleIndividualCheck(key as keyof AgreementType)
                    }
                  >
                    <span
                      className={`inline-block ${
                        agreements[key as keyof AgreementType]
                          ? 'text-[#00CCCC]'
                          : 'text-[#C8C8C8]'
                      } text-lg mr-4`}
                    >
                      ✔
                    </span>
                    <span className='text-sm text-[#AFAFAF]'>
                      {getAgreementLabel(key as keyof AgreementType)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleModalClose}
              className={`w-full py-5 ${
                allChecked ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8] cursor-not-allowed'
              } text-white text-lg font-medium fixed bottom-0 left-0 right-0`}
              disabled={!allChecked}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDataSelectPage;
