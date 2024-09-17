import React from 'react';
import { useNavigate } from 'react-router-dom';

const WalletBalanceSection: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  return (
    <div className='w-full bg-white p-4 rounded-lg shadow-md mb-8'>
      {/* 챌릿계좌 제목과 잔액 */}
      <div className='text-left'>
        {' '}
        {/* 왼쪽 정렬을 위한 부모 컨테이너 */}
        <h2 className='text-sm font-medium text-gray-500 mb-4'>챌렛계좌</h2>
        <p className='text-2xl font-bold mt-2 mb-4'>314,852원</p>
      </div>

      {/* 버튼 섹션 */}
      <div className='flex justify-end gap-2'>
        {' '}
        {/* 오른쪽 정렬을 위한 flex와 justify-end 추가 */}
        <button
          className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-500 bg-white' // bg-white 클래스 추가
          onClick={() => navigate('/transfer')} // 송금 페이지로 이동
        >
          송금
        </button>
        <button
          className='border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-500 bg-white' // bg-white 클래스 추가
          onClick={() => navigate('/history')} // 내역 페이지로 이동
        >
          내역
        </button>
      </div>
    </div>
  );
};

export default WalletBalanceSection;
