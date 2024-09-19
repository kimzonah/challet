import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
}

export const TopBar = ({ title }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 left-0 right-0 bg-white'>
      <div className='flex items-center justify-between py-5 mb-3 px-3'>
        <FontAwesomeIcon
          icon={faAngleLeft}
          className='cursor-pointer'
          onClick={() => navigate(-1)}
        />
        <p className='text-lg font-semibold flex-grow text-center'>{title}</p>
        {/* 오른쪽에 비어있는 공간을 추가해서 가운데 정렬 유지 */}
        <div className='w-5' />
      </div>
    </div>
  );
};
