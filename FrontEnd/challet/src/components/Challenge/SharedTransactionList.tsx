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
  );
  const [hasNextPage, setHasNextPage] = useState(true);
  const [cursor, setCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const transactionListRef = useRef<HTMLDivElement>(null); // 스크롤을 조정할 ref
  const navigate = useNavigate();
  const userId = Number(useAuthStore.getState().userId);
  const { fetchSharedTransactions } = useChallengeApi();

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        if (!webSocketService.isConnected()) {
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
              ...receivedTransaction,
              sharedTransactionId: receivedTransaction.id,
              transactionDateTime: new Date().toISOString(),
              goodCount: 0,
              sosoCount: 0,
              badCount: 0,
              commentCount: 0,
              userEmoji: null,
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
          const emojiUpdate = JSON.parse(message.body);

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
                    userEmoji: emojiUpdate.type,
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
  }, [challengeId]);

  const fetchTransactions = async (scrollToBottom = false) => {
    if (!hasNextPage || isLoading) return;
    setIsLoading(true);

    const response = await fetchSharedTransactions(challengeId, cursor);

    if (response && response.history) {
      const reversedHistory = [...response.history].reverse();

      setSharedTransactions((prev) => [...reversedHistory, ...prev]);
      setHasNextPage(response.hasNextPage);

      const lastTransaction = response.history[response.history.length - 1];
      if (lastTransaction) {
        setCursor(lastTransaction.sharedTransactionId);
      }

      // 데이터를 불러온 후 스크롤을 맨 아래로 이동
      if (scrollToBottom && transactionListRef.current) {
        transactionListRef.current!.scrollTop =
          transactionListRef.current!.scrollHeight;
      }
    }

    setIsLoading(false);
  };

  // 스크롤 이벤트 처리: 상단에 도달 시 새로운 데이터를 가져옴
  const handleScroll = () => {
    if (
      transactionListRef.current &&
      transactionListRef.current.scrollTop === 0 &&
      hasNextPage &&
      !isLoading
    ) {
      setTimeout(() => {
        fetchTransactions(); // 일정 시간 이후 스크롤 상단에 도달 시 새로운 데이터 가져오기
      }, 3000); // 1000ms 지연 후 요청
    }
  };

  useEffect(() => {
    fetchTransactions(true); // 최초 로딩 시 첫 페이지 가져오기 및 스크롤 맨 아래로 이동

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

    webSocketService.sendMessage(
      `/app/challenges/${challengeId}/emoji`,
      emojiRequest
    );
  };

  return (
    <div
      className='scrollbar-hide overflow-y-auto max-h-[510px]'
      ref={transactionListRef}
    >
      {sharedTransactions.map((transaction: Transaction) => (
        <div
          key={transaction.sharedTransactionId}
          className={`p-4 bg-[#F1F4F6] rounded-lg max-w-[90%] md:max-w-[500px] ${
            transaction.userId === userId ? 'ml-auto ml-4' : 'mr-auto mr-4'
          }`}
        >
          {transaction.userId === userId ? (
            <div className='flex items-center'>
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
