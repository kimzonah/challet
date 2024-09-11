import { useNavigate } from 'react-router-dom';
import ChallengeForm from '../../components/Challenge/ChallengeForm';
import CategoryList from '../../components/Challenge/CategoryList';
// import ChallengeList from '../../components/Challenge/ChallengeList';

const ChallengePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* <CategoryList /> */}
      {/* <ChallengeForm /> */}
      {/* <ChallengeList /> */}
      <button onClick={() => navigate('/challet-service/challenges/1')}>
        <span>1번 챌린지</span>
      </button>
    </div>
  );
};

export default ChallengePage;
