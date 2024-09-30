import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import Shopping from '../../assets/Challenge/Shopping.png';
import Transport from '../../assets/Challenge/Car.png';

interface RewardItemProps {
  reward: {
    rewardId: number;
    type: boolean;
    category: string;
    title: string;
    datetime: string;
  };
  onClick: (rewardId: number) => void;
}

const RewardItem = ({ reward, onClick }: RewardItemProps) => {
  const getThumbnail = (category: string) => {
    switch (category) {
      case 'DELIVERY':
        return Delivery;
      case 'COFFEE':
        return Coffee;
      case 'TRANSPORT':
        return Transport;
      case 'SHOPPING':
        return Shopping;
      default:
        return '';
    }
  };

  return (
    <div className='reward-item' onClick={() => onClick(reward.rewardId)}>
      <img
        src={getThumbnail(reward.category)}
        alt={reward.category}
        className='reward-thumbnail'
      />
      <div className='reward-info'>
        <h2 className='text-sm font-medium'>{reward.title}</h2>
        <p className='text-xs text-gray-500'>{reward.datetime}</p>
        <p>결과: {reward.type ? '성공' : '실패'}</p>
      </div>
    </div>
  );
};

export default RewardItem;
