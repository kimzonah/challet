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

  const filteredChallenges = isMyChallenges
    ? challenges.filter((challenge) => challenge.isIncluded) // 내가 참여한 챌린지 필터링
    : challenges.filter((challenge) => !challenge.isIncluded); // 참여하지 않은 챌린지 필터링

  if (filteredChallenges.length === 0) {
    return (
      <div>
        {isMyChallenges
          ? '나의 챌린지가 없습니다.'
          : '참여 가능한 챌린지가 없습니다.'}
      </div>
    );
  }

  return (
    <div>
      {filteredChallenges.map((challenge, index) => (
        <div key={index} className='border rounded-md p-4 mb-4'>
          <div className='flex items-center'>
            <img
              src={categoryIcons[challenge.category] || AllSearch}
              alt={challenge.title}
              className='w-12 h-12 rounded-full'
            />
            <div className='ml-4'>
              <div className='font-bold'>{challenge.title}</div>
              <div className='text-sm text-gray-500'>
                {challenge.currentParticipants}/{challenge.maxParticipants}명 |{' '}
                {challenge.spendingLimit.toLocaleString()}원
              </div>
              <div className='flex items-center text-sm text-gray-500'>
                <img
                  src={TimeFill}
                  alt='시간 아이콘'
                  className='w-4 h-4 mr-1'
                />
                {new Date(challenge.startDate).toLocaleDateString()} 시작 |{' '}
                {Math.floor(
                  (new Date(challenge.endDate).getTime() -
                    new Date(challenge.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
                일 동안
              </div>
              {challenge.inviteCode && (
                <div className='text-sm text-gray-500'>
                  초대 코드: {challenge.inviteCode}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChallengeForm;
