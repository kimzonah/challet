import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import SharedTransactionComments from './SharedTransactionComments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faSyncAlt,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'; // 수정 아이콘 추가
import Emoji_1 from '../../assets/Challenge/Emoji-1.png'; // 이모티콘 이미지 import
import Emoji_2 from '../../assets/Challenge/Emoji-2.png';
import Emoji_3 from '../../assets/Challenge/Emoji-3.png';
import Comment from '../../assets/Challenge/Comment.png';

const SharedTransactionDetail = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 sharedTransactionId 가져오기
  const { exampleTransactions } = useChallengeApi(); // 더미 데이터를 가져옴
  const [transactionDetail, setTransactionDetail] = useState<any>(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  useEffect(() => {
    const fetchDetail = async () => {
      if (id) {
        // 더미 데이터에서 해당 id를 가진 거래 내역을 찾음
        const detail = exampleTransactions.find(
          (transaction) => transaction.sharedTransactionId === Number(id)
        );
        setTransactionDetail(detail || null); // detail이 없을 경우 null 처리
      }
    };
    fetchDetail();
  }, [id]);

  if (!transactionDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-4'>
      {/* 탑바 */}
      <div className='fixed top-0 left-0 right-0 bg-white z-10'>
        <div className='flex justify-between pt-8 px-3 items-center'>
          <FontAwesomeIcon
            icon={faAngleLeft}
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          <p className='text-lg font-semibold'>
            {transactionDetail.withdrawal} |{' '}
            {transactionDetail.transactionAmount.toLocaleString()}원
          </p>
          {transactionDetail.isMine ? (
            <FontAwesomeIcon
              icon={faEdit} // 수정 아이콘
              className='cursor-pointer'
              onClick={() => {
                // 수정 페이지로 이동하고, transactionDetail 데이터를 전달
                navigate('/sharedTransactionEdit', {
                  state: { transaction: transactionDetail },
                });
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faSyncAlt} // 새로고침 아이콘
              className='cursor-pointer'
              onClick={() => window.location.reload()} // 새로고침
            />
          )}
        </div>
      </div>

      <div className='mt-16 scrollbar-hide overflow-y-auto max-h-[580px]'>
        <div className='flex items-center'>
          <img
            src={transactionDetail.profileImage || '/default_profile.png'}
            alt={transactionDetail.nickname}
            className='w-10 h-10 rounded-full mr-2'
          />
          <span className='font-semibold'>{transactionDetail.nickname}</span>
        </div>

        {transactionDetail.image && (
          <div className='my-4'>
            <img
              src={transactionDetail.image}
              alt='거래 이미지'
              className='w-full h-64 object-cover rounded-lg mb-2'
            />
          </div>
        )}

        <p className='mb-4 text-lg'>{transactionDetail.content}</p>

        {/* 이모티콘 및 댓글 개수 */}
        <div className='flex space-x-4 py-2 border-b-2 border-dashed'>
          <div className='flex items-center'>
            <img src={Emoji_3} alt='Emoji 3' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.threeEmojiNum}</span>
          </div>
          <div className='flex items-center'>
            <img src={Emoji_2} alt='Emoji 2' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.twoEmojiNum}</span>
          </div>
          <div className='flex items-center'>
            <img src={Emoji_1} alt='Emoji 1' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.oneEmojiNum}</span>
          </div>
          <div className='flex items-center'>
            <img src={Comment} alt='comment' className='w-5 h-5 mr-1' />
            <span>{transactionDetail.commentNum}</span>
          </div>
        </div>

        {/* 댓글 컴포넌트에 refreshComments 상태 전달 */}
        <SharedTransactionComments
          sharedTransactionId={transactionDetail.sharedTransactionId}
        />
      </div>

      {/* 댓글 입력창 */}
      <div className='fixed bottom-0 left-0 right-0 bg-white p-4 border-t-2'>
        <div className='flex items-center'>
          <input
            type='text'
            placeholder='댓글을 입력하세요.'
            className='flex-grow px-4 py-2 border rounded-lg mr-2'
          />
          <button className='bg-[#00CCCC] text-white px-4 py-2 rounded-lg'>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedTransactionDetail;
