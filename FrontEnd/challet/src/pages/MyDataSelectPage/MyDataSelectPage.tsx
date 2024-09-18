import { useState } from 'react';

type IndividualChecksType = {
  serviceAgreement: boolean;
  financialTransaction: boolean;
  personalInfoUsage: boolean;
  withdrawalConsent: boolean;
  thirdPartyInfo: boolean;
};

const MyDataSelectPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // 모달이 열려 있는지 여부
  const [allChecked, setAllChecked] = useState(false); // 전체 동의 체크박스 상태
  const [individualChecks, setIndividualChecks] =
    useState<IndividualChecksType>({
      serviceAgreement: false,
      financialTransaction: false,
      personalInfoUsage: false,
      withdrawalConsent: false,
      thirdPartyInfo: false,
    });

  // 은행 선택 상태 관리
  const [selectedBanks, setSelectedBanks] = useState({
    shinhan: false,
    kb: false,
    nh: false,
  });

  const handleAllChecked = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    setIndividualChecks({
      serviceAgreement: newState,
      financialTransaction: newState,
      personalInfoUsage: newState,
      withdrawalConsent: newState,
      thirdPartyInfo: newState,
    });
  };

  // handleIndividualCheck 함수 추가
  const handleIndividualCheck = (field: keyof IndividualChecksType) => {
    setIndividualChecks((prevState) => {
      const newState = { ...prevState, [field]: !prevState[field] };
      setAllChecked(Object.values(newState).every((value) => value));
      return newState;
    });
  };

  const handleBankSelect = (bank: keyof typeof selectedBanks) => {
    setSelectedBanks((prevState) => ({
      ...prevState,
      [bank]: !prevState[bank], // 이 부분에서 오류를 해결
    }));
  };

  const handleConfirm = () => {
    if (allChecked) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-6 relative'>
      {/* 모달이 열려있으면 동의 체크박스 표시 */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50'>
          <div className='bg-white rounded-t-3xl shadow-lg w-full max-w-md'>
            <div className='p-6'>
              <h3 className='text-lg font-semibold text-[#373A3F] mb-4'>
                오픈뱅킹 이용동의
              </h3>
              <div className='flex items-center mb-4'>
                <input
                  type='checkbox'
                  id='agree-all'
                  checked={allChecked}
                  onChange={handleAllChecked}
                  className='mr-2'
                />
                <label htmlFor='agree-all' className='text-m text-[#373A3F]'>
                  전체 동의
                </label>
              </div>
              {Object.entries(individualChecks).map(([key, value]) => (
                <div
                  key={key}
                  className='flex items-center w-full mb-2 text-left'
                >
                  <input
                    type='checkbox'
                    id={key}
                    checked={value}
                    onChange={() =>
                      handleIndividualCheck(key as keyof IndividualChecksType)
                    }
                    className='mr-2'
                  />
                  <label htmlFor={key} className='text-sm w-full'>
                    {key}
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              className={`w-full py-5 ${
                allChecked
                  ? 'bg-[#00CCCC] text-white'
                  : 'bg-[#C8C8C8] text-white cursor-not-allowed'
              }`}
              disabled={!allChecked}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 은행 선택 화면 */}
      {!isModalOpen && (
        <div className='w-full max-w-md'>
          <h3 className='text-lg font-semibold text-[#373A3F] mb-4'>
            연결할 계좌 한번에 찾기
          </h3>
          <p className='text-sm mb-4'>계좌를 연결할 은행을 선택해주세요.</p>
          <div className='space-y-2'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='shinhan'
                checked={selectedBanks.shinhan}
                onChange={() => handleBankSelect('shinhan')}
                className='mr-2'
              />
              <label htmlFor='shinhan'>신한은행</label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='kb'
                checked={selectedBanks.kb}
                onChange={() => handleBankSelect('kb')}
                className='mr-2'
              />
              <label htmlFor='kb'>국민은행</label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='nh'
                checked={selectedBanks.nh}
                onChange={() => handleBankSelect('nh')}
                className='mr-2'
              />
              <label htmlFor='nh'>농협은행</label>
            </div>
          </div>
          <button className='w-full py-5 bg-[#00CCCC] text-white mt-6'>
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default MyDataSelectPage;
