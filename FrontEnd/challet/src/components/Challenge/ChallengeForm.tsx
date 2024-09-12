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
  // 기본값으로 빈 배열 설정 및 조건부 렌더링 추가
  if (!Array.isArray(challenges) || challenges.length === 0) {
    return <div>챌린지가 없습니다.</div>;
  }

  // 카테고리 이미지 결정
  const getCategoryImage = (category: string) => {
    return categoryIcons[category] || AllSearch;
  };

  return (
    <div>
      {challenges.map((challenge, index) => (
        <div key={index} className='border rounded-md p-4 mb-4'>
          <div className='flex items-center'>
            <img
              src={getCategoryImage(challenge.category)} // 카테고리별 이미지 선택
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
