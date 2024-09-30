import { useNavigate } from 'react-router-dom';
import onboardImage from '../../assets/onboardImage.png'; // 이미지 경로에 맞게 수정해주세요

const OnboardingPage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/phone-auth'); // 회원가입 버튼을 누르면 전화번호 인증 페이지로 이동
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className='flex flex-col items-center justify-between min-h-screen py-8 px-6 bg-white'>
      {/* 온보딩 텍스트 */}
      <div className='text-left pt-8'>
        <p className='text-lg text-gray-800 mb-1'>결제와 자산관리 외에도</p>
        <p className='text-lg text-gray-800 mb-1'>소비 습관 개선 챌린지 등</p>
        <p className='text-lg text-gray-800 mb-1'>
          <span className='font-bold'>다양한 서비스</span>를 이용할 수 있어요!
        </p>
      </div>

      {/* 온보딩 이미지 */}
      <img src={onboardImage} alt='온보딩 이미지' className='w-64 mb-4' />

      {/* 로그인/가입 버튼 */}
      <div className='flex flex-col space-y-4 mt-8 w-full'>
        <button
          onClick={handleLogin}
          className='w-full py-3 bg-teal-400 text-white text-lg rounded-md'
        >
          로그인
        </button>
        <button
          onClick={handleSignUp}
          className='w-full py-3 border border-teal-400 text-teal-400 text-lg rounded-md'
        >
          가입하기
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
