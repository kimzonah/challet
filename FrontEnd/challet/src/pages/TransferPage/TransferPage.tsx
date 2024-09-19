import { useState } from 'react';
import { TopBar } from '../../components/topbar/topbar';

function TransferPage() {
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 금액 형식 변환 함수
  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
  };

  // 금액 입력 변경 처리 함수
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '').replace(/원/g, '');
    if (!isNaN(value) && value !== '') {
      setAmount(formatNumber(value));
    } else {
      setAmount('');
    }
  };

  // 계좌번호 입력 처리 함수
  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAccountNumber(value);
  };

  // 송금 처리 함수
  const handleSubmit = () => {
    if (!bank || !accountNumber || !amount) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const formattedAmount = amount.replace(/,/g, '').replace(/원/g, '');
    setConfirmationMessage(`${accountNumber}님에게\n${amount}을 보냈어요`);
    setShowConfirmation(true);

    // 송금 처리 로직 예시
    console.log('은행:', bank);
    console.log('계좌번호:', accountNumber);
    console.log('보낼 금액:', formattedAmount);
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-between p-4 relative'>
      <TopBar title='송금' />

      {!showConfirmation ? (
        <div className='flex flex-col items-center justify-center w-full mt-40'>
          <div className='w-full max-w-sm mb-4'>
            <div className='relative'>
              {/* 은행 선택 */}
              <select
                className='w-full px-4 py-4 bg-gray-100 rounded-lg focus:ring-0 focus:outline-none mb-6 text-gray-400 appearance-none'
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
                style={{ top: '-8px' }}
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

            {/* 계좌번호 입력 */}
            <input
              type='text'
              className='w-full px-4 py-4 bg-gray-100 rounded-lg focus:ring-0 focus:outline-none mb-12'
              placeholder='계좌번호 입력'
              value={accountNumber}
              onChange={handleAccountNumberChange}
              maxLength={16}
            />

            {/* 보낼 금액 입력 */}
            <div className='w-full mb-2 border-b border-gray-400'>
              <input
                type='text'
                className='w-full px-4 py-2 focus:outline-none focus:ring-0 bg-white text-lg font-semibold text-gray-700'
                placeholder='보낼 금액 입력'
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <p className='text-right text-xs text-gray-400'>최대 314,892원</p>
          </div>

          {/* 확인 버튼 */}
          <button
            onClick={handleSubmit}
            className='fixed bottom-0 left-0 right-0 w-full py-5 bg-[#00CCCC] text-white font-bold text-lg'
          >
            확인
          </button>
        </div>
      ) : (
        // 확인 메시지 화면
        <div className='flex flex-col items-center justify-center h-full'>
          <div className='flex flex-col items-center justify-center mt-60'>
            <div className='w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center'>
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

          {/* 확인 버튼 */}
          <button
            onClick={() => setShowConfirmation(false)}
            className='fixed bottom-0 left-0 right-0 w-full py-5 bg-[#00CCCC] text-white font-bold text-lg'
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}

export default TransferPage;
