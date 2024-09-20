import { useState, useEffect } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import ChallengeModal from './ChallengeModal';
import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import TimeFill from '../../assets/Challenge/TimeFill.png';
import Lock from '../../assets/Challenge/Lock.png';

export interface Challenge {
  challengeId: number;
  status: string;
  category: string;
  title: string;
  spendingLimit: number;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
}

interface ChallengeFormProps {
  challenges: Challenge[];
  isMyChallenges: boolean; // 나의 챌린지 여부를 나타내는 플래그
}

const categoryIcons: Record<string, string> = {
  COFFEE: Coffee,
  DELIVERY: Delivery,
  TRANSPORT: Car,
  SHOPPING: Shopping,
  ALL: AllSearch,
};

// 5가지 색상 정의
const backgroundColors = [
  'bg-red-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-purple-200',
];

const getRandomBackgroundColor = () => {
  return backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
};

const ChallengeForm = ({ challenges, isMyChallenges }: ChallengeFormProps) => {
  // challenges가 배열이 아닌 경우 빈 배열로 처리
  const validChallenges = Array.isArray(challenges) ? challenges : [];
  const { joinChallenge, fetchChallengeDetail } = useChallengeApi();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [challengeDetail, setChallengeDetail] = useState<any | null>(null); // 선택된 챌린지 상태
  const [inviteCodeInput, setInviteCodeInput] = useState(''); // 초대코드 입력 상태
  const [challengeColors, setChallengeColors] = useState<
    Record<number, string>
  >({}); // 챌린지 ID별 배경색 상태

  useEffect(() => {
    // 이미 배경색이 설정된 챌린지는 제외하고, 새롭게 배경색을 할당
    const newColors: Record<number, string> = {};
    validChallenges.forEach((challenge) => {
      if (!challengeColors[challenge.challengeId]) {
        newColors[challenge.challengeId] = getRandomBackgroundColor();
      }
    });

    // 새로운 색상만 업데이트
    if (Object.keys(newColors).length > 0) {
      setChallengeColors((prevColors) => ({ ...prevColors, ...newColors }));
    }
  }, [validChallenges]); // 챌린지 목록이 변경될 때만 실행

  if (!Array.isArray(validChallenges) || validChallenges.length === 0) {
    return <div>챌린지가 없습니다.</div>;
  }

  const handleChallengeClick = async (challengeId: number) => {
    const detail = await fetchChallengeDetail(challengeId);
    setChallengeDetail(detail);
    setIsModalOpen(true); // 모달 열기
    setInviteCodeInput(''); // 모달 열릴 때 입력 필드 초기화
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setChallengeDetail(null); // 선택된 챌린지 초기화
  };

  const handleJoinChallenge = async () => {
    if (!challengeDetail) return;

    const inviteCode = challengeDetail.isPublic ? null : inviteCodeInput;
    await joinChallenge(
      challengeDetail.challengeId,
      challengeDetail.isPublic,
      inviteCode
    );
    handleCloseModal(); // 모달 닫기
  };

  const renderChallenges = (challenges: Challenge[], isCompleted = false) => {
    return challenges.map((challenge) => (
      <div
        key={challenge.challengeId}
        className={`border rounded-md p-4 mb-4 ${
          isCompleted ? 'opacity-50' : ''
        }`}
        onClick={() => handleChallengeClick(challenge.challengeId)} // 클릭 시 모달 열기
        style={{ cursor: 'pointer' }}
      >
        <div className='flex items-center'>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${challengeColors[challenge.challengeId]}`}
          >
            <img
              src={categoryIcons[challenge.category] || AllSearch}
              alt={challenge.title}
              className='w-12 h-12'
            />
          </div>
          <div className='ml-4'>
            <div className='font-bold flex ml-5 items-center'>
              {challenge.title}
              {!challenge.isPublic && (
                <img src={Lock} alt='비공개 챌린지' className='ml-2 w-4 h-4' />
              )}
            </div>
            <div className='flex'>
              <div className='text-sm text-gray-500 ml-5 mr-4'>
                {challenge.currentParticipants}/{challenge.maxParticipants}명
              </div>
              <div className='text-sm text-[#00B8B8]'>
                {challenge.spendingLimit.toLocaleString()}원
              </div>
            </div>
            <div className='flex items-center text-sm text-gray-700'>
              <img src={TimeFill} alt='시간 아이콘' className='w-4 h-4 mr-1' />
              {new Date(challenge.startDate).toLocaleDateString()} 시작 /{' '}
              {Math.floor(
                (new Date(challenge.endDate).getTime() -
                  new Date(challenge.startDate).getTime()) /
                  (1000 * 60 * 60 * 24) +
                  1
              )}
              일 동안
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className='scrollbar-hide overflow-y-auto max-h-[570px]'>
      {isMyChallenges ? (
        <>
          {/* 진행 중인 챌린지 */}
          {validChallenges.filter(
            (challenge) => challenge.status === 'PROGRESSING'
          ).length > 0 && (
            <div className='mb-6 border-b-2 border-dashed'>
              <h2 className='flex text-lg font-bold mb-2'>진행 중인 챌린지</h2>
              {renderChallenges(
                validChallenges.filter(
                  (challenge) => challenge.status === 'PROGRESSING'
                )
              )}
            </div>
          )}

          {/* 대기 중인 챌린지 */}
          {validChallenges.filter(
            (challenge) => challenge.status === 'RECRUITING'
          ).length > 0 && (
            <div className='mb-6 border-b-2 border-dashed'>
              <h2 className='flex text-lg font-bold mb-2'>대기 중인 챌린지</h2>
              {renderChallenges(
                validChallenges.filter(
                  (challenge) => challenge.status === 'RECRUITING'
                )
              )}
            </div>
          )}

          {/* 완료된 챌린지 */}
          {validChallenges.filter((challenge) => challenge.status === 'END')
            .length > 0 && (
            <div className='mb-6'>
              <h2 className='flex text-lg font-bold mb-2'>완료된 챌린지</h2>
              {renderChallenges(
                validChallenges.filter(
                  (challenge) => challenge.status === 'END'
                ),
                true
              )}
            </div>
          )}
        </>
      ) : (
        <div className='scrollbar-hide overflow-y-auto max-h-[400px]'>
          {renderChallenges(validChallenges)}
        </div>
      )}

      {/* 모달 컴포넌트 */}
      {isModalOpen && challengeDetail && (
        <ChallengeModal
          onClose={handleCloseModal}
          challengeDetail={challengeDetail} // 상세 정보 전달
          inviteCodeInput={inviteCodeInput}
          setInviteCodeInput={setInviteCodeInput}
          handleJoinChallenge={handleJoinChallenge}
        />
      )}
    </div>
  );
};

export default ChallengeForm;
