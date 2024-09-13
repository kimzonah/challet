import axios from 'axios';
import { useState } from 'react';

// API 요청 공통 함수
export const useChallengeApi = () => {
  const [challenges, setChallenges] = useState([]); // 챌린지 데이터 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // API 요청 함수
  const fetchChallenges = async (
    keyword: string,
    category: string,
    isMyChallenges = false
  ) => {
    setIsLoading(true); // 로딩 시작
    try {
      const url = isMyChallenges
        ? 'https://localhost:8000/challet-service/challenges/my-challenges'
        : 'https://localhost:8000/challet-service/challenges';

      // API 요청 직전 로그 찍기
      console.log('API 요청:', {
        url,
        params: { keyword, category },
      });

      const response = await axios.get(url, {
        params: { keyword, category },
      });

      // API 응답 성공 시 로그
      console.log('API 응답 성공:', response.data);
      setChallenges(response.data);
    } catch (error) {
      // API 호출 중 오류 발생 시 로그
      console.error('API 호출 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  return { challenges, isLoading, fetchChallenges };
};
