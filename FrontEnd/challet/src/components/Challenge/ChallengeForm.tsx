import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import shopping from '../../assets/Challenge/Shopping.png';
import TimeFill from '../../assets/Challenge/TimeFill.png';

interface Challenge {
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
  SHOPPING: shopping,
  ALL: AllSearch,
};

const ChallengeForm = ({ challenges, isMyChallenges }: ChallengeFormProps) => {
  if (!Array.isArray(challenges) || challenges.length === 0) {
    return <div>챌린지가 없습니다.</div>;
  }

  // 챌린지 상태별로 필터링
  const progressingChallenges = challenges.filter(
    (challenge) => challenge.status === 'PROGRESSING'
  );
  const recruitingChallenges = challenges.filter(
    (challenge) => challenge.status === 'RECRUITING'
  );
  const completedChallenges = challenges.filter(
    (challenge) => challenge.status === 'END'
  );

  // 챌린지 렌더링 함수 (완료된 챌린지는 불투명하게)
  const renderChallenges = (challenges: Challenge[], isCompleted = false) => {
    return challenges.map((challenge, index) => (
      <div
        key={index}
        className={`border rounded-md p-4 mb-4 ${
          isCompleted ? 'opacity-50' : ''
        }`}
      >
        <div className='flex items-center'>
          <img
            src={categoryIcons[challenge.category] || AllSearch}
            alt={challenge.title}
            className='w-12 h-12 rounded-full'
          />
          <div className='ml-4'>
            <div className='font-bold flex ml-5'>{challenge.title}</div>
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

  // 나의 챌린지에서만 섹션 나누기
  if (isMyChallenges) {
    return (
      <div>
        {/* 진행 중인 챌린지 */}
        {progressingChallenges.length > 0 && (
          <div className='mb-6 border-b-2 border-dashed'>
            <h2 className='flex text-lg font-bold mb-2'>진행 중인 챌린지</h2>
            {renderChallenges(progressingChallenges)}
          </div>
        )}

        {/* 대기 중인 챌린지 */}
        {recruitingChallenges.length > 0 && (
          <div className='mb-6 border-b-2 border-dashed'>
            <h2 className='flex text-lg font-bold mb-2'>대기 중인 챌린지</h2>
            {renderChallenges(recruitingChallenges)}
          </div>
        )}

        {/* 완료된 챌린지 */}
        {completedChallenges.length > 0 && (
          <div className='mb-6'>
            <h2 className='flex text-lg font-bold mb-2'>완료된 챌린지</h2>
            {renderChallenges(completedChallenges, true)}{' '}
            {/* 완료된 챌린지는 불투명 */}
          </div>
        )}
      </div>
    );
  }

  // 챌린지 찾기일 때는 섹션을 나누지 않고 그대로 렌더링
  return <div>{renderChallenges(challenges)}</div>;
};

export default ChallengeForm;
