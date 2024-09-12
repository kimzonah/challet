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
        ? '/challet-service/challenges/my-challenges'
        : '/challet-service/challenges';
      const response = await axios.get(url, {
        params: { keyword, category },
      });
      setChallenges(response.data);
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  return { challenges, isLoading, fetchChallenges };
};
