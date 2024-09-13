import { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const ChallengeModal = ({ onClose, children }: ModalProps) => {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-600'
        >
          닫기
        </button>
        {children}
      </div>
    </div>
  );
};

export default ChallengeModal;
