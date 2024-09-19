// src/components/Wallet/MyDataConnectButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅
import MyDataButton from '../../assets/wallet/mydata-button.png';

const MyDataConnectButton: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handleButtonClick = () => {
    navigate('/mydataselect'); // /mydataselect 페이지로 이동
  };

  return (
    <div>
      {/* 마이데이터 연결 버튼 */}
      <img
        src={MyDataButton}
        alt='MyData Button'
        className='w-full h-auto'
        onClick={handleButtonClick} // 버튼 클릭 시 /mydataselect 페이지로 이동
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default MyDataConnectButton;
