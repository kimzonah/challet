import ChallengePlus from '../../assets/Challenge/ChallengePlus.png';
import { useNavigate } from 'react-router-dom';

const ChallengeCreateButton = () => {
  const navigate = useNavigate();
  const handleCreateChallenge = () => {
    // 챌린지 생성하기 버튼 클릭 시 처리할 로직
    console.log('챌린지 생성하기 클릭됨');
    navigate('/challenge/create'); // 챌린지 생성 페이지로 이동
  };

  return (
    <div className='fixed bottom-16 left-0 right-12 flex justify-end w-full mb-4'>
      <button
        onClick={handleCreateChallenge}
        className='bg-white transform transition-transform duration-300 ease-in-out hover:scale-110'
      >
        {/* 이미지 버튼으로 사용 */}
        <img
          src={ChallengePlus}
          alt='챌린지 생성하기'
          className='w-16 h-16 object-contain mr-4 mb-4 bg-white'
        />
      </button>
    </div>
  );
};

export default ChallengeCreateButton;
