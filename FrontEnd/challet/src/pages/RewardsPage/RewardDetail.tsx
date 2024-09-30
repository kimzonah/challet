interface RewardDetailProps {
  rewardDetail: {
    title: string;
    category: string;
    spendingLimit: number;
    startDate: string;
    endDate: string;
    spendingAmount: number;
    type: boolean;
  };
  onClose: () => void;
}

const RewardDetail = ({ rewardDetail, onClose }: RewardDetailProps) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-xl font-bold mb-4'>{rewardDetail.title}</h2>
        <p>카테고리: {rewardDetail.category}</p>
        <p>사용 제한: {rewardDetail.spendingLimit}</p>
        <p>시작일: {rewardDetail.startDate}</p>
        <p>종료일: {rewardDetail.endDate}</p>
        <p>사용 금액: {rewardDetail.spendingAmount}</p>
        <p>결과: {rewardDetail.type ? '성공' : '실패'}</p>
        <button
          onClick={onClose}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default RewardDetail;
