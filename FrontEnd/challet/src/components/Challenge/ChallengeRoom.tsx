import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ChallengeRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { challenge } = location.state || {};

  if (!challenge) {
    return <div>챌린지 정보가 없습니다.</div>;
  }

  return (
    <div className='min-h-screen flex flex-col bg-[#F1F4F6]'>
      {/* 탑바 변경을 위해 다시 만듦 */}
      <div className='fixed top-0 left-0 right-0'>
        <div className='flex justify-between pt-8 px-3 items-center bg-[#F1F4F6]'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className=''
            onClick={() => navigate(-1)}
          />
          <p className='text-lg font-semibold'>{challenge.title}</p>
          <FontAwesomeIcon icon={faBars} className='' />
        </div>
      </div>

      {/* 지출 추가하기 버튼 */}
      <div className='w-full fixed bottom-0'>
        <button className='w-full py-[30px] bg-[#00CCCC] text-white hover:bg-teal-600'>
          지출 추가하기
        </button>
      </div>
    </div>
  );
};

export default ChallengeRoom;
