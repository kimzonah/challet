import Flag from '../../assets/ProgressbarFlag.png';

interface ChallengeProgressbarProps {
  currentSpending: number; // 현재 지출 금액
  spendingLimit: number; // 지출 한도
}

const ChallengeProgressbar = ({
  currentSpending,
  spendingLimit,
}: ChallengeProgressbarProps) => {
  const percentage = (currentSpending / spendingLimit) * 100; // 지출 한도 대비 지출 퍼센티지 계산

  return (
    <div className=''>
      <div className='flex justify-between mt-1 text-sm'>
        <span>사용 금액: {currentSpending.toLocaleString()}원</span>
        <span>한도: {spendingLimit.toLocaleString()}원</span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-4 mt-4'>
        <div
          className='bg-[#00CCCC] h-4 rounded-full'
          style={{ width: `${percentage}%` }} // 퍼센티지에 따라 너비 설정
        ></div>
      </div>
    </div>
  );
};

export default ChallengeProgressbar;
