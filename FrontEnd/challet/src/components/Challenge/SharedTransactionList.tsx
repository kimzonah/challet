import { useEffect, useState, useRef } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Comment from '../../assets/Challenge/Comment.png';
import Emoji_1 from '../../assets/Challenge/Emoji-1.png';
import Emoji_2 from '../../assets/Challenge/Emoji-2.png';
import Emoji_3 from '../../assets/Challenge/Emoji-3.png';

// 트랜잭션 타입 정의
interface Transaction {
  isMine: boolean;
  userId: number;
  nickname: string;
  profileImage: string;
  sharedTransactionId: number;
  withdrawal: string;
  transactionAmount: number;
  transactionDateTime: string;
  content: string;
  image: string;
  threeEmojiNum: number;
  twoEmojiNum: number;
  oneEmojiNum: number;
  commentNum: number;
  pushedEmoji: number; // 내가 누른 이모티콘
}

const TransactionList = ({ challengeId }: { challengeId: number }) => {
  const { exampleTransactions } = useChallengeApi(); // 더미 데이터를 가져옴
  const [sharedTransactions, setSharedTransactions] = useState<Transaction[]>(
    []
  );
  const transactionListRef = useRef<HTMLDivElement>(null); // 스크롤을 조정할 ref
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  useEffect(() => {
    // 트랜잭션을 시간 오름차순으로 정렬 (가장 오래된 내역이 위, 최신 내역이 아래로)
    const sortedTransactions = [...exampleTransactions].sort(
      (a, b) =>
        new Date(a.transactionDateTime).getTime() -
        new Date(b.transactionDateTime).getTime()
    );
    setSharedTransactions(sortedTransactions);
  }, [challengeId]);

  useEffect(() => {
    // 거래 내역이 변경될 때마다 스크롤을 맨 아래로 이동
    if (transactionListRef.current) {
      transactionListRef.current.scrollTop =
        transactionListRef.current.scrollHeight;
    }
  }, [sharedTransactions]);

  // 시간 형식 변경 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // 12시간 형식
    });
  };

  // 거래 내역 클릭 시 상세 페이지로 이동
  const handleTransactionClick = (sharedTransactionId: number) => {
    navigate(`/sharedTransactionDetail/${sharedTransactionId}`);
  };

  // 이모지 버튼 클릭 핸들러
  const handleEmojiClick = (transactionId: number, emojiType: number) => {
    // API 호출 예시
    console.log(`Transaction ID: ${transactionId}, Emoji Type: ${emojiType}`);
    // 실제 API 호출 로직 추가 필요
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
            transaction.isMine ? 'ml-auto ml-4' : 'mr-auto mr-4'
          }`} // 내 거래는 오른쪽에 정렬, 다른 사람의 거래는 왼쪽에 정렬
        >
          {/* 내 거래 내역일 경우 */}
          {transaction.isMine ? (
            <div className='text-right flex items-center'>
              <div className='text-sm text-gray-400 mr-2'>
                {formatTime(transaction.transactionDateTime)}
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
                  {/* 거래 내역의 이름, 가격, 내용을 포함하는 칸에만 onClick 이벤트를 적용 */}
                  <div
                    className='bg-white p-3 rounded-xl shadow-md mb-2 w-full cursor-pointer'
                    onClick={() =>
                      handleTransactionClick(transaction.sharedTransactionId)
                    }
                  >
                    <div className='flex items-center justify-between'>
                      <div className='font-semibold'>
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
                    <p className='text-gray-500'>{transaction.content}</p>
                  </div>
                </div>
                <div className='flex justify-end items-center'>
                  <div className='flex items-center ml-4'>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.pushedEmoji === 3
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() =>
                        handleEmojiClick(transaction.sharedTransactionId, 3)
                      }
                    >
                      <img
                        src={Emoji_3}
                        alt='Emoji 3'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.threeEmojiNum}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.pushedEmoji === 2
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() =>
                        handleEmojiClick(transaction.sharedTransactionId, 2)
                      }
                    >
                      <img
                        src={Emoji_2}
                        alt='Emoji 2'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.twoEmojiNum}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.pushedEmoji === 1
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() =>
                        handleEmojiClick(transaction.sharedTransactionId, 1)
                      }
                    >
                      <img
                        src={Emoji_1}
                        alt='Emoji 1'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.oneEmojiNum}</span>
                    </button>
                    <div className='flex items-center mr-2 bg-white p-2 rounded-lg shadow-md'>
                      <img
                        src={Comment}
                        alt='comment'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.commentNum}</span>
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
                <span className='font-semibold flex'>
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
                  {/* 거래 내역의 이름, 가격, 내용을 포함하는 칸에만 onClick 이벤트를 적용 */}
                  <div
                    className='bg-white p-3 rounded-xl shadow-md mb-2 w-full cursor-pointer'
                    onClick={() =>
                      handleTransactionClick(transaction.sharedTransactionId)
                    }
                  >
                    <div className='flex items-center justify-between'>
                      <div className='font-semibold'>
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
                    <p className='text-gray-500'>{transaction.content}</p>
                  </div>
                  <div className='text-sm text-gray-400 ml-1'>
                    {formatTime(transaction.transactionDateTime)}
                  </div>
                </div>

                <div className='flex justify-start items-center'>
                  <div className='flex items-center'>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.pushedEmoji === 3
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() =>
                        handleEmojiClick(transaction.sharedTransactionId, 3)
                      }
                    >
                      <img
                        src={Emoji_3}
                        alt='Emoji 3'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.threeEmojiNum}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.pushedEmoji === 2
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() =>
                        handleEmojiClick(transaction.sharedTransactionId, 2)
                      }
                    >
                      <img
                        src={Emoji_2}
                        alt='Emoji 2'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.twoEmojiNum}</span>
                    </button>
                    <button
                      className={`flex items-center mr-2 bg-white p-2 rounded-lg shadow-md ${
                        transaction.pushedEmoji === 1
                          ? 'border-2 border-[#00CCCC]'
                          : ''
                      }`}
                      onClick={() =>
                        handleEmojiClick(transaction.sharedTransactionId, 1)
                      }
                    >
                      <img
                        src={Emoji_1}
                        alt='Emoji 1'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.oneEmojiNum}</span>
                    </button>
                    <div className='flex items-center mr-2 bg-white p-2 rounded-lg shadow-md'>
                      <img
                        src={Comment}
                        alt='comment'
                        className='w-5 h-5 mr-1'
                      />
                      <span>{transaction.commentNum}</span>
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
