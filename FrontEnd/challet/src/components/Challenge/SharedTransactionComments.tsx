import { useEffect, useState } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';
import defaultProfile from '../../assets/mypage/default-profile.png';

interface Comment {
  nickname: string;
  profileImage: string;
  content: string;
}

const SharedTransactionComments = ({
  sharedTransactionId,
  refreshComments,
}: {
  sharedTransactionId: number;
  refreshComments: boolean;
}) => {
  const { fetchTransactionComments } = useChallengeApi();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments =
        await fetchTransactionComments(sharedTransactionId);
      setComments(fetchedComments);
    };

    // 댓글을 처음 불러올 때와 refreshComments 또는 sharedTransactionId가 변경될 때만 호출
    fetchComments();
  }, [sharedTransactionId, refreshComments]); // fetchTransactionComments는 의존성 배열에서 제거

  if (comments.length === 0) {
    return <div>댓글이 없습니다.</div>;
  }

  return (
    <div className='mt-6'>
      <div className='mt-4'>
        {comments.map((comment, index) => (
          <div key={index} className='mb-4 p-3 bg-gray-100 rounded-lg'>
            <div className='flex items-start mb-2 border-b-2 border-dashed'>
              <img
                src={
                  comment.profileImage === null
                    ? defaultProfile
                    : comment.profileImage
                }
                alt={comment.nickname}
                className='w-8 h-8 rounded-full mr-2 mb-2'
              />
              <span className='font-semibold'>{comment.nickname}</span>
            </div>
            {/* 긴 영어 단어도 줄바꿈되도록 word-break: break-all 적용하고, 왼쪽 정렬 */}
            <p
              className='break-words text-left'
              style={{ wordBreak: 'break-all' }}
            >
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedTransactionComments;
