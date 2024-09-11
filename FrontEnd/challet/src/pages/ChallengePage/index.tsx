import { useNavigate } from 'react-router-dom';
import ChallengeForm from '../../components/Challenge/ChallengeForm';

const ChallengePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='challenge-page'>
        <h2 className='text-red-500'>Challenge Page</h2>
      </div>
      <ChallengeForm />
      <button onClick={() => navigate('/challet-service/challenges/1')}>
        <span>1번 챌린지</span>
      </button>
    </div>
  );
};

export default ChallengePage;
