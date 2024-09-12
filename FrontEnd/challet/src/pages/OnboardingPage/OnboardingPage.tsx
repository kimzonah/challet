import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/phone-auth'); // 회원가입 버튼을 누르면 전화번호 인증 페이지로 이동
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className='onboarding-container'>
      <div className='onboarding-card'>
        <p className='onboarding-text'>회원가입 또는 로그인을 진행하세요.</p>

        <button onClick={handleSignUp}>회원가입</button>
        <button onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
};

export default OnboardingPage;
