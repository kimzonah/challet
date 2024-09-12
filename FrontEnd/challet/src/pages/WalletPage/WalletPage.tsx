import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 사용하여 페이지 이동
import ChalletLogo from '../../assets/wallet/challet-logo.png';
import MyDataButton from '../../assets/wallet/mydata-button.png';
import PaymentButton from '../../assets/wallet/payment-button.png';

const WalletPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handlePaymentClick = () => {
    navigate('/payment'); // /payment 페이지로 이동
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center p-2 mt-12'>
      {/* Header */}
      <div className='w-full flex flex-col items-center mb-8'>
        {/* 로고 이미지 */}
        <div className='w-full flex justify-start'>
          <img
            src={ChalletLogo}
            alt='Challet Logo'
            className='w-28 h-auto ml-2 mt-16 mb-8'
          />
        </div>

        {/* 결제하기 버튼 */}
        <img
          src={PaymentButton}
          alt='Payment Button'
          className='w-full h-auto'
          onClick={handlePaymentClick} // 버튼 클릭 시 /payment 페이지로 이동
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Wallet Balance Section */}
      <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
        {/* 챌릿계좌 제목과 잔액 */}
        <h2 className='text-sm font-medium text-gray-500'>챌릿계좌</h2>
        <p className='text-3xl font-bold mt-2 mb-4'>314,852원</p>

        {/* 버튼 섹션 */}
        <div className='flex gap-2'>
          <button className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-500'>
            송금
          </button>
          <button className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-500'>
            내역
          </button>
        </div>
      </div>

      {/* MyData Button Section */}
      <img src={MyDataButton} alt='MyData Button' className='w-full h-auto' />
    </div>
  );
};

export default WalletPage;
