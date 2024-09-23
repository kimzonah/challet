import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/topbar/topbar';
import shinhanLogo from '../../assets/mydata/sh-logo.png';
import kbLogo from '../../assets/mydata/kb-logo.png';
import nhLogo from '../../assets/mydata/nh-logo.png';

type AgreementType = {
  serviceAgreement: boolean;
  financialTransaction: boolean;
  personalInfoUsage: boolean;
  withdrawalConsent: boolean;
  thirdPartyInfo: boolean;
};

const MyDataSelectPage = () => {
  const navigate = useNavigate();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [agreements, setAgreements] = useState<AgreementType>({
    serviceAgreement: false,
    financialTransaction: false,
    personalInfoUsage: false,
    withdrawalConsent: false,
    thirdPartyInfo: false,
  });

  // 전체 동의 상태 관리
  const [allChecked, setAllChecked] = useState(false);

  // 전체 동의 핸들러
  const handleAllChecked = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setAgreements({
      serviceAgreement: newState,
      financialTransaction: newState,
      personalInfoUsage: newState,
      withdrawalConsent: newState,
      thirdPartyInfo: newState,
    });
  };

  // 개별 항목 동의 핸들러
  const handleIndividualCheck = (key: keyof AgreementType) => {
    setAgreements((prevState) => {
      const newState = { ...prevState, [key]: !prevState[key] };
      const allChecked = Object.values(newState).every((value) => value);
      setAllChecked(allChecked);
      return newState;
    });
  };

  // 모달 닫기 함수
  const handleModalClose = () => {
    if (allChecked) {
      setIsModalOpen(false);
    }
  };

  // 리다이렉트 함수
  const redirectToWallet = () => {
    navigate('/wallet'); // /wallet 경로로 리다이렉트
  };

  // 은행 선택 상태 관리
  const [selectedBanks, setSelectedBanks] = useState({
    shinhan: false,
    kb: false,
    nh: false,
  });

  // 은행 선택 핸들러
  const handleBankSelect = (bank: keyof typeof selectedBanks) => {
    setSelectedBanks((prevState) => ({
      ...prevState,
      [bank]: !prevState[bank],
    }));
  };

  // 한 가지 이상의 은행이 선택되었는지 확인하는 함수
  const isAnySelected = Object.values(selectedBanks).some((value) => value);

  return (
    <div className='min-h-screen bg-white'>
      <TopBar title='' />

      {/* 은행 선택 내용 */}
      <div className='mt-20 p-4 text-left'>
        <h2 className='text-xl text-[#373A3F]'>
          연결할 계좌 <br />
          <span className='font-bold'>한번에 찾기</span>
        </h2>
        <p className='text-sm text-[#373A3F] mt-2 mb-24'>
          계좌를 연결할 은행을 선택해주세요.
        </p>
        <div className='mt-8 space-y-4'>
          {/* 신한은행 */}
          <div
            className='p-6 flex justify-between items-center bg-gray-100 rounded-lg cursor-pointer'
            onClick={() => handleBankSelect('shinhan')}
          >
            <div className='flex items-center'>
              <img src={shinhanLogo} alt='신한은행' className='w-8 h-8 mr-3' />
              <span className='text-[#585962] font-medium'>신한은행</span>
            </div>
            <span
              className={`w-7 h-7 flex justify-center items-center ${
                selectedBanks.shinhan ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8]'
              } text-white rounded-full`}
            >
              ✔
            </span>
          </div>

          {/* 국민은행 */}
          <div
            className='p-6 flex justify-between items-center bg-gray-100 rounded-lg cursor-pointer'
            onClick={() => handleBankSelect('kb')}
          >
            <div className='flex items-center'>
              <img src={kbLogo} alt='국민은행' className='w-8 h-8 mr-3' />
              <span className='text-[#585962] font-medium'>국민은행</span>
            </div>
            <span
              className={`w-7 h-7 flex justify-center items-center ${
                selectedBanks.kb ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8]'
              } text-white rounded-full`}
            >
              ✔
            </span>
          </div>

          {/* 농협은행 */}
          <div
            className='p-6 flex justify-between items-center bg-gray-100 rounded-lg cursor-pointer'
            onClick={() => handleBankSelect('nh')}
          >
            <div className='flex items-center'>
              <img src={nhLogo} alt='농협은행' className='w-7 h-8 mr-4' />
              <span className='text-[#585962] font-medium'>농협은행</span>
            </div>
            <span
              className={`w-7 h-7 flex justify-center items-center ${
                selectedBanks.nh ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8]'
              } text-white rounded-full`}
            >
              ✔
            </span>
          </div>
        </div>
      </div>

      {/* 확인 버튼 */}
      <button
        className={`fixed bottom-0 left-0 right-0 w-full py-5 ${
          isAnySelected ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8] cursor-not-allowed'
        } text-white font-medium text-lg`}
        disabled={!isAnySelected}
      >
        확인
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50'>
          <div className='bg-white rounded-t-3xl w-full max-w-md shadow-lg pb-20 relative'>
            <div className='p-6'>
              <div className='flex justify-center items-center mb-6'>
                <h2 className='text-lg font-medium text-[#373A3F]'>
                  오픈뱅킹 이용동의
                </h2>
                <button
                  onClick={redirectToWallet} // X 버튼 클릭 시 /wallet으로 리다이렉트
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
                      {agreements[key as keyof AgreementType] ? '✔' : '✔'}
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
              } text-white text-lg font-semibold fixed bottom-0 left-0 right-0`}
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

// 각 동의 항목의 라벨을 반환

// 각 동의 항목의 라벨을 반환하는 함수
const getAgreementLabel = (key: keyof AgreementType) => {
  switch (key) {
    case 'serviceAgreement':
      return '오픈뱅킹 서비스 동의(필수)';
    case 'financialTransaction':
      return '오픈뱅킹 금융거래제공동의(필수)';
    case 'personalInfoUsage':
      return '오픈뱅킹 개인정보 수집이용제공 동의(필수)';
    case 'withdrawalConsent':
      return '오픈뱅킹 출금/조회 동의(필수)';
    case 'thirdPartyInfo':
      return '출금 이체를 위한 개인정보 제3자제공동의(필수)';
    default:
      return '';
  }
};

export default MyDataSelectPage;
