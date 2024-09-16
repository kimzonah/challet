import Flag from '../../assets/Challenge/ProgressbarFlag.png';

interface ChallengeProgressbarProps {
  currentSpending: number; // 현재 지출 금액
  spendingLimit: number; // 지출 한도
  remainDays: number; // 남은 일 수
}

const ChallengeProgressbar = ({
  currentSpending,
  spendingLimit,
  remainDays,
}: ChallengeProgressbarProps) => {
  const percentage = (currentSpending / spendingLimit) * 100; // 지출 한도 대비 지출 퍼센티지 계산

  return (
    <div className=''>
      <div className='flex justify-between'>
        <div>
          <img src={Flag} alt='flag' className='w-6 h-6' />
        </div>
        <div className='mt-1 text-sm'>
          <span>{currentSpending.toLocaleString()}원&nbsp;/&nbsp;</span>
          <span className='text-[#9095A1]'>
            {spendingLimit.toLocaleString()}원
          </span>
        </div>
        <div className='mt-1 text-sm text-[#9095A1]'>
          <span>{remainDays.toLocaleString()}일 남음</span>
        </div>
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
