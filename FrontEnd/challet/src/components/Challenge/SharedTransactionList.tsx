import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// import Comment from '../../assets/Challenge/Comment.png';
import Emoji_1 from '../../assets/Challenge/Emoji-1.png';
import Emoji_2 from '../../assets/Challenge/Emoji-2.png';
import Emoji_3 from '../../assets/Challenge/Emoji-3.png';
import useAuthStore from '../../store/useAuthStore';
import webSocketService from '../../hooks/websocket'; // 웹소켓 서비스 추가
import throttle from 'lodash/throttle'; // 스크롤 이벤트 성능 최적화를 위한 throttle 함수 추가
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
  const cursorRef = useRef<number | null>(null);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false); // isLoading을 useRef로 변경
  const transactionListRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const userId = Number(useAuthStore.getState().userId);
  const { fetchSharedTransactions } = useChallengeApi();
  const navigate = useNavigate();

  const fetchTransactions = async (scrollToBottom = false) => {
    if (
      isFetchingRef.current ||
      !hasNextPageRef.current ||
      isLoadingRef.current
    )
      return;

    isFetchingRef.current = true;
    isLoadingRef.current = true; // 로딩 시작

    // 현재 스크롤 위치 저장
    const previousScrollHeight = transactionListRef.current?.scrollHeight || 0;
    const previousScrollTop = transactionListRef.current?.scrollTop || 0;

    const response = await fetchSharedTransactions(
      challengeId,
      cursorRef.current
    );

    if (response && response.history) {
      const reversedHistory = [...response.history].reverse();

      setSharedTransactions((prev) => {
        const newTransactions = reversedHistory.filter(
          (transaction) =>
            !prev.some(
              (t) => t.sharedTransactionId === transaction.sharedTransactionId
            )
        );
        return [...newTransactions, ...prev];
      });

      const lastTransaction = response.history[response.history.length - 1];
      if (lastTransaction) {
        cursorRef.current = lastTransaction.sharedTransactionId;
      }

      hasNextPageRef.current = response.hasNextPage;

      if (scrollToBottom && transactionListRef.current) {
        // 전체 높이의 변화량 계산
        const newScrollHeight = transactionListRef.current.scrollHeight;
        const scrollDifference = newScrollHeight - previousScrollHeight;

        // 기존 스크롤 위치로 복원
        transactionListRef.current.scrollTop =
          previousScrollTop + scrollDifference;
      }
    }

    isFetchingRef.current = false;
    isLoadingRef.current = false; // 로딩 끝
  };

  const handleScrollThrottled = throttle(() => {
    if (
      transactionListRef.current &&
      transactionListRef.current.scrollTop === 0 &&
      hasNextPageRef.current &&
      !isLoadingRef.current &&
      !isFetchingRef.current
    ) {
      fetchTransactions();
    }
  }, 300);

  useEffect(() => {
    fetchTransactions(true);
    const ref = transactionListRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScrollThrottled);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScrollThrottled);
      }
    };
  }, []);

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
                          ? 'ring-2 ring-[#00CCCC]'
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
                          ? 'ring-2 ring-[#00CCCC]'
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
                          ? 'ring-2 ring-[#00CCCC]'
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
                          ? 'ring-2 ring-[#00CCCC]'
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
                          ? 'ring-2 ring-[#00CCCC]'
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
                          ? 'ring-2 ring-[#00CCCC]'
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
