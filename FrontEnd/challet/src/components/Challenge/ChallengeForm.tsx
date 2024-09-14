import { useState } from 'react';
import ChallengeModal from './ChallengeModal';
import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import TimeFill from '../../assets/Challenge/TimeFill.png';
import Lock from '../../assets/Challenge/Lock.png';

export interface Challenge {
  id: number;
  status: string;
  isIncluded: boolean;
  category: string;
  title: string;
  spendingLimit: number;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
  inviteCode?: string | null;
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
  // 랜덤으로 색상 배열에서 하나를 선택
  return backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
};

const ChallengeForm = ({ challenges, isMyChallenges }: ChallengeFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  ); // 선택된 챌린지

  if (!Array.isArray(challenges) || challenges.length === 0) {
    return <div>챌린지가 없습니다.</div>;
  }

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge); // 선택한 챌린지 저장
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setSelectedChallenge(null); // 선택된 챌린지 초기화
  };

  const handleJoinChallenge = () => {
    // 참가하기 버튼 클릭 시 동작할 함수 추가 가능
    console.log(`${selectedChallenge?.title}에 참가합니다.`);
    // 참가 관련 추가 로직 작성
  };

  const renderChallenges = (challenges: Challenge[], isCompleted = false) => {
    return challenges.map((challenge, index) => (
      <div
        key={index}
        className={`border rounded-md p-4 mb-4 ${isCompleted ? 'opacity-50' : ''}`}
        onClick={() => handleChallengeClick(challenge)} // 클릭 시 모달 열기
        style={{ cursor: 'pointer' }}
      >
        <div className='flex items-center'>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRandomBackgroundColor()}`}
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
                  (1000 * 60 * 60 * 24)
              )}
              일 동안
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      {isMyChallenges ? (
        <>
          {/* 진행 중인 챌린지 */}
          {challenges.filter((challenge) => challenge.status === 'PROGRESSING')
            .length > 0 && (
            <div className='mb-6 border-b-2 border-dashed'>
              <h2 className='flex text-lg font-bold mb-2'>진행 중인 챌린지</h2>
              {renderChallenges(
                challenges.filter(
                  (challenge) => challenge.status === 'PROGRESSING'
                )
              )}
            </div>
          )}

          {/* 대기 중인 챌린지 */}
          {challenges.filter((challenge) => challenge.status === 'RECRUITING')
            .length > 0 && (
            <div className='mb-6 border-b-2 border-dashed'>
              <h2 className='flex text-lg font-bold mb-2'>대기 중인 챌린지</h2>
              {renderChallenges(
                challenges.filter(
                  (challenge) => challenge.status === 'RECRUITING' && challenge.isIncluded
                )
              )}
            </div>
          )}

          {/* 완료된 챌린지 */}
          {challenges.filter((challenge) => challenge.status === 'END').length >
            0 && (
            <div className='mb-6'>
              <h2 className='flex text-lg font-bold mb-2'>완료된 챌린지</h2>
              {renderChallenges(
                challenges.filter((challenge) => challenge.status === 'END'),
                true
              )}
            </div>
          )}
        </>
      ) : (
        <div>{renderChallenges(challenges)}</div>
      )}

      {/* 모달 컴포넌트 */}
      {isModalOpen && selectedChallenge && (
        <ChallengeModal onClose={handleCloseModal}>
          <div className=''>
            <div className='font-bold text-lg'>{selectedChallenge.title}</div>
            <div
              className={`flex p-2 justify-items-start items-center mt-4 border-2 rounded-xl`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRandomBackgroundColor()}`}
              >
                <img
                  src={categoryIcons[selectedChallenge.category] || AllSearch}
                  alt={selectedChallenge.title}
                  className='w-12 h-12'
                />
              </div>
              <div className='ml-4'>
                <div className='flex text-sm text-gray-500'>
                  {selectedChallenge.currentParticipants}/
                  {selectedChallenge.maxParticipants}명 참여 중
                </div>
                <div className='flex text-sm mr-16 text-base'>
                  <div className='text-[#00B8B8]'>{selectedChallenge.spendingLimit.toLocaleString()}원&nbsp;</div>
                  <div>사용 한도</div>
                </div>
                <div className='flex text-sm items-center'>
                  <img src={TimeFill} alt='시간 아이콘' className='w-4 h-4 mr-1' />
                  {new Date(selectedChallenge.startDate).toLocaleDateString()} 시작
                </div>
                <div className='flex text-sm items-center'>
                  <img src={TimeFill} alt='시간 아이콘' className='w-4 h-4 mr-1' />
                  {new Date(selectedChallenge.endDate).toLocaleDateString()} 종료
                </div>
              </div>
            </div>

            {/* 참가하기 버튼 */}
            {!selectedChallenge.isIncluded && (
              <div className='mt-4'>
                <button
                  onClick={handleJoinChallenge}
                  className='bg-[#00CCCC] text-white py-4 px-4 rounded-lg hover:bg-teal-600'
                >
                  도전하기
                </button>
              </div>
            )}
          </div>
        </ChallengeModal>
      )}
    </div>
  );
};

export default ChallengeForm;
