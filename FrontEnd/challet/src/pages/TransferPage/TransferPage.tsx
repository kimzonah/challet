import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TopBar } from '../../components/topbar/topbar';

function TransferPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountBalance } = location.state || {}; // 전달받은 잔액 정보만 사용
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [warningMessage, setWarningMessage] = useState(''); // 경고 메시지 상태

  // 금액을 쉼표가 들어가게 변환하는 함수 (string 타입 명시)
  const formatNumberWithCommas = (value: string): string => {
    const cleanedValue = value.replace(/[^0-9]/g, ''); // 숫자만 남김
    return cleanedValue ? parseInt(cleanedValue, 10).toLocaleString() : '';
  };

  // 금액 입력 변경 처리 함수
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력되게 처리
    const numericAmount = parseInt(inputAmount, 10);

    if (numericAmount > accountBalance) {
      setWarningMessage(
        `최대 ${accountBalance?.toLocaleString()}원까지 보낼 수 있어요.`
      );
    } else {
      setAmount(formatNumberWithCommas(inputAmount));
      setWarningMessage(''); // 경고 메시지 초기화
    }
  };

  // 계좌번호 입력 처리 함수
  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자 외의 문자 제거
    setAccountNumber(value);
  };

  // 송금 처리 함수
  const handleSubmit = () => {
    if (!bank || !accountNumber || !amount) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setConfirmationMessage(`${accountNumber}님에게\n${amount}원을 보냈어요`);
    setShowConfirmation(true);
  };

  // 모든 필드가 채워졌는지 확인
  const allChecked = bank && accountNumber && amount && !warningMessage;

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-between p-4 relative'>
      <TopBar title='송금' />

      {!showConfirmation ? (
        <div className='flex flex-col items-center justify-center w-full mt-40'>
          <div className='w-full max-w-sm mb-4'>
            <div className='relative'>
              <select
                className='w-full px-4 py-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#00CCCC] focus:outline-none mb-6 text-gray-400 appearance-none'
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                <option value='' disabled>
                  은행 선택
                </option>
                <option value='bank1'>챌렛뱅크</option>
                <option value='bank2'>신한은행</option>
                <option value='bank3'>국민은행</option>
                <option value='bank4'>농협은행</option>
              </select>
              <div
                className='absolute inset-y-0 right-3 flex items-center pointer-events-none'
                style={{ top: '-16px' }}
              >
                <svg
                  className='w-4 h-4 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </div>

            {/* 계좌번호 입력 (숫자만 입력 가능) */}
            <input
              type='text'
              className='w-full px-4 py-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#00CCCC] focus:outline-none mb-12'
              placeholder='계좌번호 입력'
              value={accountNumber}
              onChange={handleAccountNumberChange}
              maxLength={20}
            />

            {/* 보낼 금액 입력 (아래쪽만 테두리) */}
            <div className='w-full mb-2 border-b border-gray-400'>
              <input
                type='text'
                className='w-full px-4 py-2 bg-white text-lg font-medium text-gray-700 focus:border-b-2 focus:border-[#00CCCC] focus:outline-none'
                placeholder='보낼 금액 입력'
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <p className='text-right text-xs text-gray-400'>
              최대 {accountBalance?.toLocaleString()}원
            </p>
            {warningMessage && (
              <p className='text-red-500 text-xs mt-1'>{warningMessage}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full py-5 ${allChecked ? 'bg-[#00CCCC]' : 'bg-[#C8C8C8] cursor-not-allowed'} text-white text-lg font-medium fixed bottom-0 left-0 right-0`}
            disabled={!allChecked}
          >
            확인
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <div className='flex flex-col items-center justify-center mt-60'>
            <div className='w-16 h-16 bg-[#00CCCC] rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='text-xl text-[#373A3F] font-semibold mt-6 text-center whitespace-pre-line'>
              {confirmationMessage}
            </h2>
          </div>

          <button
            onClick={() => {
              setShowConfirmation(false);
              navigate('/wallet');
            }}
            className='fixed bottom-0 left-0 right-0 w-full py-5 bg-[#00CCCC] text-white font-medium text-lg'
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}

export default TransferPage;
