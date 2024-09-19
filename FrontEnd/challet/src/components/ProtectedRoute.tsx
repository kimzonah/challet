import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { accessToken } = useAuthStore(); // Zustand에서 Access Token 가져오기

  if (!accessToken) {
    // Access Token이 없으면 로그인 페이지로 리다이렉트
    return <Navigate to='/login' />;
  }

  // Access Token이 있으면 페이지 렌더링
  return children;
};

export default ProtectedRoute;
