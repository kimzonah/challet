import { useState } from 'react';

const MyDataSelectPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [allChecked, setAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState({
    serviceAgreement: false,
    financialTransaction: false,
    personalInfoUsage: false,
    withdrawalConsent: false,
    thirdPartyInfo: false,
  });

  const handleCloseModal = () => setIsModalOpen(false);

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

  const handleIndividualCheck = (field: string) => {
    setIndividualChecks((prevState) => {
      const newState = { ...prevState, [field]: !prevState[field] };
      setAllChecked(Object.values(newState).every((value) => value));
      return newState;
    });
  };

  // 스타일 객체의 타입을 React.CSSProperties로 지정
  const labelStyles: React.CSSProperties = {
    color: '#AFAFAF',
    textAlign: 'left',
  };

  const getLabelText = (key: string) => {
    switch (key) {
      case 'serviceAgreement':
        return <span style={labelStyles}>오픈뱅킹 서비스 동의 (필수)</span>;
      case 'financialTransaction':
        return (
          <span style={labelStyles}>오픈뱅킹 금융거래제공동의 (필수)</span>
        );
      case 'personalInfoUsage':
        return (
          <span style={labelStyles}>
            오픈뱅킹 개인정보 수집이용제공 동의 (필수)
          </span>
        );
      case 'withdrawalConsent':
        return <span style={labelStyles}>오픈뱅킹 출금/조회 동의 (필수)</span>;
      case 'thirdPartyInfo':
        return <span style={labelStyles}>개인정보 제3자제공동의 (필수)</span>;
      default:
        return '';
    }
  };

  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-6'>
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
                    onChange={() => handleIndividualCheck(key)}
                    className='mr-2'
                  />
                  <label htmlFor={key} className='text-sm w-full'>
                    {getLabelText(key)}
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={handleCloseModal}
              className={`w-full py-5 ${allChecked ? 'bg-[#00CCCC] text-white' : 'bg-[#C8C8C8] text-white cursor-not-allowed'}`}
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
