import { useEffect, useState } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';

interface ChallengeDetailProps {
  challengeId: number|null ; // 챌린지 ID를 받는 Props
}

const ChallengeDetail = ({ challengeId }: ChallengeDetailProps) => {
  const { exampleChallenges } = useChallengeApi();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    if (challengeId) {
      const selectedChallenge = exampleChallenges.find(
        (challenge) => challenge.id === challengeId
      );
      setChallenge(selectedChallenge);
    }
  }, [challengeId, exampleChallenges]);

  if (!challenge) {
    return <div>챌린지 정보를 불러오는 중...</div>;
  }

  return (
    <div>
      <h1>{challenge.title}</h1>
      <p>카테고리: {challenge.category}</p>
      <p>참여 인원: {challenge.currentParticipants}/{challenge.maxParticipants}</p>
      <p>지출 한도: {challenge.spendingLimit.toLocaleString()}원</p>
      <p>시작 날짜: {new Date(challenge.startDate).toLocaleDateString()}</p>
      <p>종료 날짜: {new Date(challenge.endDate).toLocaleDateString()}</p>

      {/* 참가 버튼 */}
      <button
        onClick={() => {
          console.log('참여하기 버튼 클릭');
          // API를 호출해 챌린지 참여 로직을 추가할 수 있음
        }}
      >
        참여하기
      </button>
    </div>
  );
};

export default ChallengeDetail;
