import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// challetAxiosInstance
const challetAxiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/challet', // 백엔드 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청에 accessToken을 헤더에 추가
challetAxiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState(); // Zustand에서 accessToken 가져오기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 새 accessToken 발급
challetAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (error.response?.status === 401 && refreshToken) {
      try {
        // Refresh Token을 사용하여 새로운 Access Token 발급 요청
        const { data } = await challetAxiosInstance.post(
          '/challet-service/auth/refresh',
          { refreshToken }
        );
        const newAccessToken = data.accessToken;

        // 새로운 Access Token과 Refresh Token 저장
        setTokens(newAccessToken, refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 원래 요청 재시도
        return challetAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        clearTokens(); // 토큰 초기화 (로그아웃 처리)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default challetAxiosInstance;
