import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ChallengeProgressbar from './ChallengeProgressbar'; // Progressbar 임포트
import TransactionList from './SharedTransactionList';
import webSocketService from '../../hooks/websocket';

// 남은 일수를 계산하는 함수
const calculateRemainDays = (endDateString: string): number => {
  const endDate = new Date(endDateString); // 문자열을 Date 객체로 변환
  const currentDate = new Date(); // 현재 날짜

  // 종료일과 현재 날짜 사이의 차이를 계산 (밀리초 단위)
  const remainTime = endDate.getTime() - currentDate.getTime();

  // 밀리초를 일(day) 단위로 변환
  const remainDays = Math.ceil(remainTime / (1000 * 60 * 60 * 24));

  return remainDays;
};

const ChallengeRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { challenge } = location.state || {};

  if (!challenge) {
    return <div>챌린지 정보가 없습니다.</div>;
  }

  useEffect(() => {
    // const connectAndSubscribe = async () => {
    //   try {
    //     // 웹소켓이 이미 연결되어 있는지 확인
    //     if (!webSocketService.isConnected()) {
    //       // 웹소켓 연결이 완료된 후 구독
    //       await webSocketService.connect();
    //       console.log('WebSocket 연결 완료 후 구독 시작');
    //     } else {
    //       console.log('이미 WebSocket이 연결되어 있습니다.');
    //     }

    //     // 구독 진행
    //     webSocketService.subscribe(challenge.challengeId, (message) => {
    //       console.log('받은 거래 메시지:', message.body);
    //       const transaction = JSON.parse(message.body);
    //       // 받은 메시지 처리 로직 추가
    //       console.log('거래 내역:', transaction);
    //     });
    //   } catch (error) {
    //     console.error('WebSocket 연결 실패:', error);
    //   }
    // };

    // connectAndSubscribe();

    return () => {};
  }, [challenge.challengeId]);

  // 남은 일 수 계산
  const remainDays = calculateRemainDays(challenge.endDate);

  // 지출 추가하기 버튼 클릭 시 SharedTransactionCreate로 navigate
  const handleAddTransaction = () => {
    navigate('/sharedTransactionCreate', {
      state: { id: challenge.challengeId },
    });
  };

  // 뒤로가기 버튼 클릭 시 웹소켓 연결 끊고 뒤로가기
  const handleBackClick = () => {
    webSocketService.disconnect(); // 웹소켓 연결 해제
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className='min-h-screen flex flex-col bg-[#F1F4F6]'>
      {/* 탑바 변경을 위해 다시 만듦 */}
      <div className='fixed top-0 left-0 right-0'>
        <div className='flex justify-between pt-8 px-3 items-center bg-[#F1F4F6]'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className=''
            onClick={handleBackClick} // 뒤로가기 클릭 시 웹소켓 연결 해제 후 이동
          />
          <p className='text-lg font-semibold'>{challenge.title}</p>
          <FontAwesomeIcon icon={faBars} className='' />
        </div>
      </div>

      {/* 프로그래스바 - 지출 한도 정보 표시 */}
      <div className='mt-16 flex justify-center'>
        <div className='px-4 py-2 mt-2 bg-white rounded-lg w-[90%]'>
          <ChallengeProgressbar
            currentSpending={challenge.currentSpending || 0} // 현재 지출 금액 전달
            spendingLimit={challenge.spendingLimit} // 지출 한도 전달
            remainDays={remainDays} // 남은 일 수 전달
          />
        </div>
      </div>

      {/* 트랜잭션 대화창 */}
      <div className='pb-8 flex-1 overflow-y-auto'>
        <TransactionList challengeId={challenge.challengeId} />
      </div>

      {/* 지출 추가하기 버튼 */}
      <div className='w-full fixed bottom-0'>
        <button
          className='w-full py-[30px] bg-[#00CCCC] text-white hover:bg-teal-600'
          onClick={handleAddTransaction} // 버튼 클릭 시 함수 호출
        >
          지출 추가하기
        </button>
      </div>
    </div>
  );
};

export default ChallengeRoom;
