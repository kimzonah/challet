import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth 상태 인터페이스
interface AuthState {
  accessToken: string | null; // Access Token 상태
  refreshToken: string | null; // Refresh Token 상태 (string | null로 변경)
  setAuthData: (data: {
    accessToken: string;
    refreshToken: string | null;
  }) => void; // Access Token과 Refresh Token을 저장
  setTokens: (newAccessToken: string, refreshToken: string | null) => void; // 새로운 Access Token 설정
  clearTokens: () => void; // Access Token 및 Refresh Token 초기화 (로그아웃 시 사용)
  clearAuthData: () => void; // 전체 Auth 데이터를 초기화
}

// Zustand로 Auth 상태 관리
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,

      // 상태 저장
      setAuthData: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      // 새로운 토큰 저장
      setTokens: (newAccessToken: string, refreshToken: string | null) => {
        set({ accessToken: newAccessToken, refreshToken });
      },

      // 토큰 초기화 (로그아웃 시)
      clearTokens: () => set({ accessToken: null, refreshToken: null }),

      // 전체 Auth 데이터 초기화 (로그아웃 시)
      clearAuthData: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키
    }
  )
);

export default useAuthStore;
