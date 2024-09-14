import axios from 'axios';
import { useState } from 'react';

// API 요청 공통 함수
export const useChallengeApi = () => {
  const [challenges, setChallenges] = useState([]); // 챌린지 데이터 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const exampleChallenges = [
    {
      id: 1,
      status: 'RECRUITING',
      isIncluded: false,
      category: 'COFFEE',
      title: '커피 대신 물 마시기',
      spendingLimit: 10000,
      startDate: '2023-09-20',
      endDate: '2023-09-30',
      maxParticipants: 10,
      currentParticipants: 5,
      isPublic: true,
      inviteCode: null,
    },
    {
      id: 2,
      status: 'PROGRESSING',
      isIncluded: true,
      category: 'DELIVERY',
      title: '배달 음식 절반 줄이기',
      spendingLimit: 50000,
      startDate: '2023-08-15',
      endDate: '2023-09-15',
      maxParticipants: 20,
      currentParticipants: 18,
      isPublic: false,
      inviteCode: 'ABC123',
    },
    {
      id: 3,
      status: 'END',
      isIncluded: true,
      category: 'SHOPPING',
      title: '한달 쇼핑 멈추기 챌린지',
      spendingLimit: 0,
      startDate: '2023-07-01',
      endDate: '2023-07-31',
      maxParticipants: 30,
      currentParticipants: 30,
      isPublic: true,
      inviteCode: null,
    },
  ];


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

  return { challenges, isLoading, fetchChallenges, exampleChallenges };
};
