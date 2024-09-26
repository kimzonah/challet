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

// 트랜잭션 타입 정의
interface Transaction {
  userId: number;
  nickname: string;
  profileImage: string;
  sharedTransactionId: number; // 여기서 sharedTransactionId로 변경됨
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
  const transactionListRef = useRef<HTMLDivElement>(null); // 스크롤을 조정할 ref
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const userId = Number(useAuthStore.getState().userId);

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        // 웹소켓이 이미 연결되어 있는지 확인
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
            console.log('받은 거래 메시지:', message.body);

            // 메시지를 Transaction 타입으로 변환하면서 기본값을 설정하고
            // 웹소켓으로 오는 id를 sharedTransactionId로 변경
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

            console.log('거래 내역:', transaction);

            // 트랜잭션을 sharedTransactions에 추가하고 정렬
            setSharedTransactions((prevTransactions) => {
              // 새 트랜잭션을 포함하여 배열을 업데이트하고, 시간순으로 정렬
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
          // 받은 이모지 메시지 처리 로직 추가
        });
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
      }
    };

    connectAndSubscribe();

    return () => {};
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
  const handleEmojiClick = (transaction: Transaction, emojiType: string) => {
    // API 호출 예시
    console.log(`Transaction: ${transaction}, Emoji Type: ${emojiType}`);
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
          className={'p-4 bg-[#F1F4F6] rounded-lg max-w-[90%] md:max-w-[500px]'}
        >
          {/* 내 거래 내역일 경우 */}
          {transaction.userId === userId ? (
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
                  {/* 거래 내역의 이름, 가격, 내용을 포함하는 칸에만 onClick 이벤트를 적용 */}
                  <div
                    className='bg-white p-3 rounded-xl shadow-md mb-2 w-full cursor-pointer'
                    onClick={() =>
                      handleTransactionClick(transaction.sharedTransactionId)
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
                    {formatTime(transaction.transactionDateTime)}
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
