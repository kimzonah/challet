import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Comment from '../../assets/Challenge/Comment.png';
import Emoji_1 from '../../assets/Challenge/Emoji-1.png';
import Emoji_2 from '../../assets/Challenge/Emoji-2.png';
import Emoji_3 from '../../assets/Challenge/Emoji-3.png';
import useAuthStore from '../../store/useAuthStore';
import webSocketService from '../../hooks/websocket'; // 웹소켓 서비스 추가
import { useChallengeApi } from '../../hooks/useChallengeApi'; // API 함수 추가

// 트랜잭션 타입 정의
interface Transaction {
  userId: number;
  nickname: string;
  profileImage: string;
  sharedTransactionId: number;
  withdrawal: string;
  transactionAmount: number;
  transactionDateTime: string;
  content: string;
  image: string;
  goodCount: number;
  sosoCount: number;
  badCount: number;
  commentCount: number;
  userEmoji: string | null; // GOOD, SOSO, BAD
}

const TransactionList = ({ challengeId }: { challengeId: number }) => {
  const [sharedTransactions, setSharedTransactions] = useState<Transaction[]>(
    []
  ); // 거래 내역 상태
  const [hasNextPage, setHasNextPage] = useState(true); // 다음 페이지 여부
  const [cursor, setCursor] = useState<number | null>(null); // 다음 페이지의 커서
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const transactionListRef = useRef<HTMLDivElement>(null); // 스크롤을 조정할 ref
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const userId = Number(useAuthStore.getState().userId);
  const { fetchSharedTransactions } = useChallengeApi(); // API 함수 사용

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        if (!webSocketService.isConnected()) {
          // 웹소켓 연결이 완료된 후 구독
          await webSocketService.connect();
          console.log('WebSocket 연결 완료 후 구독 시작');
        } else {
          console.log('이미 WebSocket이 연결되어 있습니다.');
        }

        // 구독 진행
        webSocketService.subscribeTransaction(
          challengeId.toString(),
          (message) => {
            const receivedTransaction = JSON.parse(message.body);

            const transaction: Transaction = {
              ...receivedTransaction, // 받은 데이터
              sharedTransactionId: receivedTransaction.id, // id를 sharedTransactionId로 매핑
              transactionDateTime: new Date().toISOString(), // 받은 시간
              goodCount: 0, // 기본값
              sosoCount: 0, // 기본값
              badCount: 0, // 기본값
              commentCount: 0, // 기본값
              userEmoji: null, // 기본값
            };

            setSharedTransactions((prevTransactions) => {
              const updatedTransactions = [...prevTransactions, transaction];
              return updatedTransactions.sort(
                (a, b) =>
                  new Date(a.transactionDateTime).getTime() -
                  new Date(b.transactionDateTime).getTime()
              );
            });
          }
        );

        webSocketService.subscribeEmoji(challengeId.toString(), (message) => {
          console.log('받은 이모지 메시지:', message.body);
          const emojiUpdate = JSON.parse(message.body);

          // 이모지 업데이트 처리 로직
          setSharedTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
              transaction.sharedTransactionId ===
              emojiUpdate.sharedTransactionId
                ? {
                    ...transaction,
                    goodCount:
                      emojiUpdate.type === 'GOOD'
                        ? emojiUpdate.count
                        : transaction.goodCount,
                    sosoCount:
                      emojiUpdate.type === 'SOSO'
                        ? emojiUpdate.count
                        : transaction.sosoCount,
                    badCount:
                      emojiUpdate.type === 'BAD'
                        ? emojiUpdate.count
                        : transaction.badCount,
                    userEmoji: emojiUpdate.type, // 사용자 이모지를 업데이트
                  }
                : transaction
            )
          );
        });
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
      }
    };

    connectAndSubscribe();

    return () => {};
  }, [challengeId]);

  // 거래내역을 API로부터 가져오는 함수
  const fetchTransactions = async () => {
    if (!hasNextPage || isLoading) return; // 더 가져올 페이지가 없거나 로딩 중이면 중단
    setIsLoading(true);

    const response = await fetchSharedTransactions(challengeId, cursor); // API 호출

    if (response && response.history) {
      setSharedTransactions((prev) => [...response.history, ...prev]); // 새로운 데이터 추가
      setHasNextPage(response.hasNextPage); // 다음 페이지 여부 업데이트

      // 커서를 마지막 거래내역의 sharedTransactionId로 업데이트
      const lastTransaction = response.history[response.history.length - 1];
      if (lastTransaction) {
        setCursor(lastTransaction.sharedTransactionId);
      }
    }

    setIsLoading(false);
  };

  // 스크롤 이벤트 처리: 상단에 도달 시 새로운 데이터를 가져옴
  const handleScroll = () => {
    if (
      transactionListRef.current &&
      transactionListRef.current.scrollTop === 0
    ) {
      fetchTransactions(); // 스크롤 상단에 도달 시 새로운 데이터 가져오기
    }
  };

  // 초기 로딩 및 무한 스크롤을 위한 이벤트 추가
  useEffect(() => {
    fetchTransactions(); // 초기 로딩 시 첫 페이지 가져오기

    const ref = transactionListRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll);
      }
    };
  }, [cursor, hasNextPage]);

  // 이모지 버튼 클릭 핸들러
  const handleEmojiClick = (transaction: Transaction, emojiType: string) => {
    let action = 'ADD';
    let beforeType = transaction.userEmoji;

    if (beforeType === emojiType) {
      action = 'DELETE';
    } else if (beforeType) {
      action = 'UPDATE';
    }

    const emojiRequest = {
      sharedTransactionId: transaction.sharedTransactionId,
      action: action,
      type: emojiType,
      beforeType: beforeType,
    };

    console.log(`이모지 전송:`, emojiRequest);

    webSocketService.sendMessage(
      `/app/challenges/${challengeId}/emoji`,
      emojiRequest
    ); // 웹소켓으로 메시지 전송
  };

  return (
    <div
      className='scrollbar-hide overflow-y-auto max-h-[510px]'
      ref={transactionListRef}
    >
      {sharedTransactions.map((transaction: Transaction) => (
        <div
          key={transaction.sharedTransactionId}
          className={'p-4 bg-[#F1F4F6] rounded-lg max-w-[90%] md:max-w-[500px]'}
        >
          {/* 내 거래 내역일 경우 */}
          {transaction.userId === userId ? (
            <div className='text-right flex items-center'>
              <div className='text-sm text-gray-400 mr-2'>
                {new Date(transaction.transactionDateTime).toLocaleTimeString(
                  'ko-KR',
                  {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  }
                )}
              </div>
              <div className='w-full'>
                {transaction.image && (
                  <div className='my-2'>
                    <img
                      src={transaction.image}
                      alt='거래 이미지'
                      className='w-full h-48 object-cover rounded-lg mb-2'
                    />
                  </div>
                )}
                <div className='flex items-center w-full'>
                  <div
                    className='bg-white p-3 rounded-xl shadow-md mb-2 w-full cursor-pointer'
                    onClick={() =>
                      navigate(
                        `/sharedTransactionDetail/${transaction.sharedTransactionId}`
                      )
                    }
                  >
                    <div className='flex items-center justify-between'>
                      <div
                        className='font-semibold overflow-hidden'
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {transaction.withdrawal}
                        <span className='ml-2'>
                          {transaction.transactionAmount.toLocaleString()}원
                        </span>
                      </div>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className='text-gray-400'
                      />
                    </div>
                    <p
                      className='text-gray-500 text-sm overflow-hidden'
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {transaction.content}
                    </p>
                  </div>
                </div>
                <div className='flex justify-end items-center'>
                  <div className='flex items-center ml-4'>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.userEmoji === 'GOOD'
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() => handleEmojiClick(transaction, 'GOOD')}
                    >
                      <img
                        src={Emoji_3}
                        alt='Emoji 3'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.goodCount}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.userEmoji === 'SOSO'
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() => handleEmojiClick(transaction, 'SOSO')}
                    >
                      <img
                        src={Emoji_2}
                        alt='Emoji 2'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.sosoCount}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.userEmoji === 'BAD'
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() => handleEmojiClick(transaction, 'BAD')}
                    >
                      <img
                        src={Emoji_1}
                        alt='Emoji 1'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.badCount}</span>
                    </button>
                    <div className='flex items-center mr-2 bg-white p-2 rounded-lg shadow-md'>
                      <img
                        src={Comment}
                        alt='comment'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 다른 사람의 거래 내역일 경우 */
            <div className='flex'>
              <img
                src={transaction.profileImage || '/default_profile.png'}
                alt={transaction.nickname}
                className='w-10 h-10 rounded-full mr-3'
              />
              <div className='max-w-[85%] w-full'>
                <span
                  className='font-semibold flex overflow-hidden'
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {transaction.nickname}
                </span>
                {transaction.image && (
                  <div className='my-2'>
                    <img
                      src={transaction.image}
                      alt='거래 이미지'
                      className='w-full h-48 object-cover rounded-lg mb-2'
                    />
                  </div>
                )}
                <div className='flex items-center'>
                  <div
                    className='bg-white p-3 rounded-xl shadow-md mb-2 w-full cursor-pointer'
                    onClick={() =>
                      navigate(
                        `/sharedTransactionDetail/${transaction.sharedTransactionId}`
                      )
                    }
                  >
                    <div className='flex items-center justify-between'>
                      <div
                        className='font-semibold overflow-hidden'
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {transaction.withdrawal}
                        <span className='ml-2'>
                          {transaction.transactionAmount.toLocaleString()}원
                        </span>
                      </div>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className='text-gray-400'
                      />
                    </div>
                    <p
                      className='text-gray-500 text-sm overflow-hidden'
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {transaction.content}
                    </p>
                  </div>
                  <div className='text-sm text-gray-400 ml-1'>
                    {new Date(
                      transaction.transactionDateTime
                    ).toLocaleTimeString('ko-KR', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </div>
                </div>
                <div className='flex justify-start items-center'>
                  <div className='flex items-center'>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.userEmoji === 'GOOD'
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() => handleEmojiClick(transaction, 'GOOD')}
                    >
                      <img
                        src={Emoji_3}
                        alt='Emoji 3'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.goodCount}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.userEmoji === 'SOSO'
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() => handleEmojiClick(transaction, 'SOSO')}
                    >
                      <img
                        src={Emoji_2}
                        alt='Emoji 2'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.sosoCount}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.userEmoji === 'BAD'
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() => handleEmojiClick(transaction, 'BAD')}
                    >
                      <img
                        src={Emoji_1}
                        alt='Emoji 1'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.badCount}</span>
                    </button>
                    <div className='flex items-center mr-2 bg-white p-2 rounded-lg shadow-md'>
                      <img
                        src={Comment}
                        alt='comment'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
