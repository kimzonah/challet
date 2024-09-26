import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청에 accessToken을 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState(); // Zustand에서 accessToken 가져오기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

// 액세스 토큰 재발급 함수
const refreshAccessToken = (): Promise<string> => {
  return axios
    .post('/api/challet/auth/refresh', {}, { withCredentials: true })
    .then((response) => {
      const newAccessToken: string = response.data.accessToken;
      useAuthStore.getState().setAuthData({
        accessToken: newAccessToken,
        userId: useAuthStore.getState().userId || '',
      });
      return newAccessToken;
    })
    .catch((error) => {
      console.error('토큰 재발급 실패:', error);
      throw error;
    });
};

// 응답 인터셉터: 401 응답을 받으면 토큰 재발급 시도
axiosInstance.interceptors.response.use(
  (response) => response, // 응답이 정상일 때 그대로 반환
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    }; // 원래 요청 정보 저장
    const navigate = useNavigate(); // 리다이렉트를 위한 네비게이트

    // 401 에러가 발생하면 (토큰 만료 시)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 재시도를 방지
      try {
        const newAccessToken = await refreshAccessToken(); // 새로운 액세스 토큰 발급
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로운 액세스 토큰으로 Authorization 헤더 업데이트
        }
        return axiosInstance(originalRequest); // 원래 요청을 다시 보냄
      } catch (err) {
        // 재발급 실패 시 로그아웃 처리 및 리다이렉트
        console.error('재발급 실패 후 로그아웃 처리:', err);
        useAuthStore.getState().clearAuthData(); // 상태에서 인증 데이터 삭제 (로그아웃 처리)
        navigate('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
        return Promise.reject(err); // 에러를 그대로 반환
      }
    }

    return Promise.reject(error); // 다른 모든 에러는 그대로 반환
  }
);
