import axiosInstance from '../api/axios';
import { useState } from 'react';

// API 요청 공통 함수
export const useChallengeApi = () => {
  const [challenges, setChallenges] = useState<any[]>([]); // 초기값을 빈 배열로 설정
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [sharedTransactions, setSharedTransactions] = useState([]); // 트랜잭션 데이터 저장

  const exampleTransactions = [
    {
      isMine: true,
      userId: 1,
      nickname: '배고픈 고양이',
      profileImage:
        'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG',
      sharedTransactionId: 1,
      withdrawal: '망고시루 케이크',
      transactionAmount: 43000,
      transactionDateTime: '2024-09-17T14:00:00.000Z',
      content: '4만원 넘게 써버렸지만 후회 없는 선택이었습니다.',
      image: 'https://newsimg.sedaily.com/2024/07/20/2DBTAKL314_7.jpg',
      threeEmojiNum: 1,
      twoEmojiNum: 0,
      oneEmojiNum: 2,
      commentNum: 3,
      pushedEmoji: 1,
    },
    {
      isMine: false,
      userId: 2,
      nickname: '배고픈 토끼',
      profileImage:
        'https://media.istockphoto.com/id/959866606/ko/%EC%82%AC%EC%A7%84/%ED%86%A0%EB%81%BC-4-%EA%B0%9C%EC%9B%94-%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EC%95%89%EC%95%84.jpg?s=1024x1024&w=is&k=20&c=4XbJDAKpvRz0zIlSXxd7LaOBxwzGOvaEXA6B12MjHT8=',
      sharedTransactionId: 2,
      withdrawal: '냉장고 털이 비빔밥',
      transactionAmount: 0,
      transactionDateTime: '2024-09-17T13:30:00.000Z',
      content: '냉장고 잔반 털어서 비빔밥 했습니다.',
      image: '',
      threeEmojiNum: 5,
      twoEmojiNum: 0,
      oneEmojiNum: 1,
      commentNum: 1,
      pushedEmoji: 3,
    },
  ];

  const exampleComments = [
    {
      nickname: '배고픈 고양이',
      profileImage: 'https://example.com/cat_profile.png',
      content: '정말 좋은 거래네요!',
    },
    {
      nickname: '배고픈 토끼',
      profileImage: 'https://example.com/rabbit_profile.png',
      content: '이건 좀 별로인 것 같아요...',
    },
  ];

  // 챌린지 참가 API 요청 함수
  const joinChallenge = async (
    challengeId: number,
    isPublic: boolean,
    inviteCode: string | null
  ) => {
    setIsLoading(true); // 로딩 상태
    try {
      const url = `http://localhost:8081/challet-service/challenges/${challengeId}`;
      const requestBody = {
        isPublic,
        inviteCode,
      };

      // POST 요청 전송
      const response = await axiosInstance.post(url, requestBody);

      console.log('챌린지 참가 성공:', response.data);
    } catch (error) {
      console.error('챌린지 참가 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 챌린지 생성
  const createChallenge = async (requestBody: Record<string, any>) => {
    try {
      const url = 'http://localhost:8081/challet-service/challenges';
      const response = await axiosInstance.post(url, requestBody);

      console.log('챌린지 생성 성공:', response.data);
    } catch (error) {
      console.error('챌린지 생성 중 오류 발생:', error);
    }
  };

  // 챌린지 상세조회 API 요청 함수
  const fetchChallengeDetail = async (challengeId: number) => {
    try {
      const url = `http://localhost:8081/challet-service/challenges/${challengeId}`;
      const response = await axiosInstance.get(url);
      return response.data; // 상세 내역 데이터 반환
    } catch (error) {
      console.error('챌린지 상세 조회 중 오류 발생:', error);
      return null;
    }
  };

  const fetchChallenges = async (
    keyword: string,
    category: string,
    isMyChallenges = false
  ) => {
    setIsLoading(true); // 로딩 시작
    try {
      let url = '';
      let params = {};

      if (isMyChallenges) {
        // 'my-challenges'일 경우 키워드와 카테고리가 필요하지 않음
        url = 'http://localhost:8081/challet-service/challenges/my-challenges';
      } else {
        // 일반 챌린지 조회의 경우 키워드와 카테고리 필요
        url = 'http://localhost:8081/challet-service/challenges';
        params = { keyword, category }; // 파라미터 설정
      }

      const response = await axiosInstance.get(url, { params });

      // API 응답 성공 시 로그
      console.log('API 응답 성공:', response.data.challengeList);
      setChallenges(response.data.challengeList);
    } catch (error) {
      // API 호출 중 오류 발생 시 로그
      console.error('API 호출 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 트랜잭션 조회 API 요청 함수
  const fetchSharedTransactions = async (challengeId: number) => {
    setIsLoading(true); // 로딩 시작
    try {
      const url = `http://localhost:8081/challet-service/challenges/${challengeId}/shared-transactions`;

      const response = await axiosInstance.get(url);

      // API 응답 성공 시 로그 및 상태 업데이트
      console.log('트랜잭션 조회 성공:', response.data);
      setSharedTransactions(response.data);
    } catch (error) {
      // API 호출 중 오류 발생 시 로그
      console.error('트랜잭션 조회 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 트랜잭션 등록 API 요청 함수
  const registTransaction = async (
    challengeId: number,
    transaction: Record<string, any> // transaction의 타입을 Record<string, any>로 변경
  ) => {
    try {
      const url = `http://localhost:8081/challet-service/challenges/${challengeId}/shared-transactions`;

      console.log('transaction:', transaction);
      const response = await axiosInstance.post(url, transaction, {
        headers: {
          'Content-Type': 'application/json', // JSON으로 전송할 때 명시적으로 Content-Type 설정
        },
      });

      console.log('트랜잭션 등록 성공:', response.data);
    } catch (error) {
      console.error('트랜잭션 등록 중 오류 발생:', error);
    }
  };

  const editTransaction = async (
    sharedTransactionId: number,
    transaction: Record<string, any> // transaction의 타입을 Record<string, any>로 변경
  ) => {
    try {
      const url = `http://localhost:8081/challet-service/shared-transactions/${sharedTransactionId}`;

      console.log('transaction:', transaction);
      const response = await axiosInstance.patch(url, transaction, {
        headers: {
          'Content-Type': 'application/json', // JSON으로 전송할 때 명시적으로 Content-Type 설정
        },
      });

      console.log('트랜잭션 수정 성공:', response.data);
    } catch (error) {
      console.error('트랜잭션 수정 중 오류 발생:', error);
    }
  };

  // 트랜잭션 상세 조회 API 요청 함수
  const fetchSharedTransactionDetail = async (sharedTransactionId: number) => {
    try {
      const url = `http://localhost:8081/challet-service/shared-transactions/${sharedTransactionId}`;
      const response = await axiosInstance.get(url);
      return response.data; // 상세 내역 데이터 반환
    } catch (error) {
      console.error('거래 상세 조회 중 오류 발생:', error);
      return null;
    }
  };

  // 댓글 조회 API 요청 함수
  // const fetchTransactionComments = async (sharedTransactionId: number) => {
  //   실제 API 요청 부분은 주석 처리합니다.
  //   try {
  //     const url = `http://localhost:8081/challet-service/shared-transactions/${sharedTransactionId}/comments`;
  //     const response = await axiosInstance.get(url);
  //     return response.data; // 댓글 데이터 반환
  //   } catch (error) {
  //     console.error('댓글 조회 중 오류 발생:', error);
  //     return [];
  //   }

  //   주석 처리된 API 요청 대신 더미 데이터를 반환합니다.
  //   return exampleComments;
  // };

  // 댓글 조회 API 요청 함수
  const fetchExampleTransactionComments = async () => {
    // 실제 API 요청 부분은 주석 처리합니다.
    // try {
    //   const url = `https://localhost:8000/challet-service/shared-transactions/${sharedTransactionId}/comments`;
    //   const response = await axios.get(url);
    //   return response.data; // 댓글 데이터 반환
    // } catch (error) {
    //   console.error('댓글 조회 중 오류 발생:', error);
    //   return [];
    // }

    // 주석 처리된 API 요청 대신 더미 데이터를 반환합니다.
    return exampleComments;
  };

  return {
    challenges,
    isLoading,
    sharedTransactions,
    fetchChallenges,
    fetchChallengeDetail,
    createChallenge,
    joinChallenge,
    exampleTransactions,
    fetchSharedTransactions,
    registTransaction,
    editTransaction,
    fetchSharedTransactionDetail,
    // fetchTransactionComments,
    fetchExampleTransactionComments,
  };
};
