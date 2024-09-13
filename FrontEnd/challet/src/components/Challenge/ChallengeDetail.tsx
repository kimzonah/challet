import { useState } from 'react';
import ChallengeModal from './ChallengeModal';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import ChallengeForm from './ChallengeForm';

const ChallengeDetail = () => {
  const { challenges } = useChallengeApi();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedChallenge, setSelectedChallenge] = useState(null); // 선택된 챌린지

  // 챌린지 클릭 시 모달 열기
  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge); // 선택된 챌린지 설정
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setSelectedChallenge(null); // 선택된 챌린지 초기화
  };

  return (
    <div>
      <h1>Challenge Detail</h1>

      {/* 챌린지 목록을 버튼으로 */}
      <div className='challenge-list'>
        {challenges.map((challenge, index) => (
          <button
            key={index}
            onClick={() => handleChallengeClick(challenge)}
            className='challenge-item'
          >
            {challenge.title}
          </button>
        ))}
      </div>

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <ChallengeModal onClose={handleCloseModal}>
          <h2>{selectedChallenge.title}</h2>
          <p>{selectedChallenge.category}</p>
          <p>{selectedChallenge.spendingLimit.toLocaleString()}원</p>
          <p>
            {new Date(selectedChallenge.startDate).toLocaleDateString()} 시작
          </p>
          <p>{new Date(selectedChallenge.endDate).toLocaleDateString()} 종료</p>

          {/* 참여하기 버튼 */}
          <button
            onClick={() => {
              console.log('챌린지 참여:', selectedChallenge.title);
              // API 호출로 참여 로직 추가 가능
              handleCloseModal();
            }}
          >
            참여하기
          </button>
        </ChallengeModal>
      )}
    </div>
  );
};

export default ChallengeDetail;
