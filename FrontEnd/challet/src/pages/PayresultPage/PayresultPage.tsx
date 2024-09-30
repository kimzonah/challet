import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/axiosInstance';
import useAccountStore from '../../store/useAccountStore';
import { AxiosError } from 'axios';

// QR 데이터의 형식을 정의하는 인터페이스
interface ParsedData {
  deposit: string;
  transactionAmount: number;
  category: string;
}

const PayResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountInfo } = useAccountStore();
  const { qrData } = location.state || {};
  const [hasSentRequest, setHasSentRequest] = useState(false);

  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null); // 결제 성공  상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 결제 실패 메시지 상태

  // qrData가 JSON 형식일 경우 파싱
  const parsedData: ParsedData | null = (() => {
    try {
      return qrData ? JSON.parse(qrData) : null;
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  })();

  useEffect(() => {
    if (!accountInfo || !parsedData || hasSentRequest) return;

    // 결제 요청 함수
    const sendPaymentRequest = async () => {
      try {
        const data = {
          transactionAmount: parsedData.transactionAmount,
          accountNumber: accountInfo.accountNumber,
          deposit: parsedData.deposit,
          category: parsedData.category,
        };

        await AxiosInstance.post('api/ch-bank/payments', data, {
          headers: { AccountId: accountInfo.id.toString() },
        });

        setPaymentSuccess(true);
        console.log('결제 성공');
        console.log(parsedData);
        console.log(data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 400) {
            setErrorMessage('잔액이 부족합니다.');
          } else {
            setErrorMessage('결제 실패');
          }
        } else {
          setErrorMessage('결제 실패');
        }
        setPaymentSuccess(false);
        console.error('결제 실패:', error);
      } finally {
        setHasSentRequest(true); // 요청이 한 번만 보내지도록 설정
      }
    };

    sendPaymentRequest();
  }, [accountInfo, parsedData, hasSentRequest]);

  const handleNavigate = () => navigate('/wallet');

  const renderPaymentDetails = () => (
    <div className='w-full mb-8 flex flex-col items-center'>
      <div className='w-full border-t border-gray-200'></div>
      {[
        { label: '결제내역', value: parsedData?.deposit },
        { label: '카테고리', value: parsedData?.category },
        { label: '결제 금액', value: `${parsedData?.transactionAmount}원` },
      ].map(({ label, value }) => (
        <div className='w-4/5 flex justify-between py-4' key={label}>
          <p className='text-[#585962] font-medium'>{label}</p>
          <p className='text-[#585962] font-medium'>{value}</p>
        </div>
      ))}
      <div className='w-full border-b border-gray-300'></div>
    </div>
  );

  if (paymentSuccess === null) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00CCCC]'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-between p-4 relative'>
      {paymentSuccess ? ( // 결제 성공일 때의 화면
        <div className='flex flex-col items-center justify-center flex-grow w-full'>
          <div className='flex flex-col items-center mt-16'>
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
                ></path>
              </svg>
            </div>
            <h2 className='text-xl text-[#373A3F] font-bold mt-6 mb-24'>
              결제 완료
            </h2>
          </div>
          {parsedData ? (
            renderPaymentDetails()
          ) : (
            <p className='text-[#585962] text-xs mt-4 text-center'>
              No QR data found.
            </p>
          )}
        </div>
      ) : (
        // 결제 실패일 때의 화면
        <div className='flex flex-col items-center justify-center flex-grow w-full'>
          <div className='flex flex-col items-center mt-16'>
            <div className='w-16 h-16 bg-red-400 rounded-full flex items-center justify-center'>
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
                  d='M6 18L18 6M6 6l12 12'
                ></path>
              </svg>
            </div>
            <h2 className='text-xl text-[#373A3F] font-bold mt-6 mb-32'>
              결제 실패
            </h2>
            <p className='text-[#585962] text-lg font-medium mb-28 text-center'>
              {errorMessage}
            </p>
          </div>
        </div>
      )}
      <button
        onClick={handleNavigate}
        className='fixed bottom-0 left-0 right-0 w-full py-5 bg-[#00CCCC] text-white font-medium text-lg'
      >
        확인
      </button>
    </div>
  );
};

export default PayResult;
