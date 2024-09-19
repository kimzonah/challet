import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/Button/Button'; // Button 컴포넌트 가져오기

const MyPage = () => {
  const navigate = useNavigate();
  const { clearAuthData, accessToken } = useAuthStore(); // Access Token만 가져오기

  // 로그아웃 핸들러
  const handleLogout = () => {
    console.log('로그아웃 전 Access Token:', accessToken);

    // Zustand에서 Access Token 초기화
    clearAuthData();

    console.log('로그아웃 후 Access Token:', null);

    // 로그인 페이지로 이동
    navigate('/login');
  };

  // 컴포넌트가 마운트될 때 현재 Access Token 출력
  useEffect(() => {
    console.log('현재 로그인된 Access Token:', accessToken);
  }, [accessToken]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-3xl font-bold mb-4'>마이 페이지</h1>
      <p>여기는 마이 페이지입니다.</p>

      {/* 로그아웃 버튼 */}
      <Button
        text='로그아웃'
        className='fixed-bottom-button' // 하단 고정 스타일 사용
        onClick={handleLogout} // 로그아웃 처리
      />
    </div>
  );
};

export default MyPage;
