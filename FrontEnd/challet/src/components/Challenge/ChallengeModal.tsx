import { ReactNode, useEffect, useRef, useState } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const ChallengeModal = ({ onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false); // 모달이 닫히는 중인지 추적하는 상태

  // 모달 외부 클릭을 감지하여 닫기 처리
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModalWithAnimation(); // 애니메이션과 함께 모달 닫기 트리거
    }
  };

  // 이벤트 리스너 추가 및 제거 처리
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 애니메이션을 사용하여 모달을 닫고 컴포넌트 언마운트 딜레이
  const closeModalWithAnimation = () => {
    setIsClosing(true); // 닫힘 애니메이션 시작
    setTimeout(() => {
      onClose(); // 애니메이션이 끝난 후 실제로 모달을 닫음
    }, 300); // 애니메이션 시간과 동일하게 300ms 딜레이
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white p-4 rounded-xl shadow-lg relative ${
          isClosing ? 'animate-modalSlideOut' : 'animate-modalSlideIn'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ChallengeModal;
