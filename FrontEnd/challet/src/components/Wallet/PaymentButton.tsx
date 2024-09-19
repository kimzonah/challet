import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅
import PaymentButtonImage from '../../assets/wallet/payment-button.png'; // 버튼 이미지 임포트

const PaymentButton: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handlePaymentClick = () => {
    navigate('/payment'); // /payment 페이지로 이동
  };

  return (
    <img
      src={PaymentButtonImage}
      alt='Payment Button'
      className='w-full h-auto'
      onClick={handlePaymentClick} // 버튼 클릭 시 /payment 페이지로 이동
      style={{ cursor: 'pointer' }}
      role='button'
      aria-label='결제하기'
    />
  );
};

export default PaymentButton;
