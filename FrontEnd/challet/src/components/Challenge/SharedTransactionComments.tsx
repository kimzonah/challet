import { useEffect, useState } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';

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
            <div className='flex items-center mb-2'>
              <img
                src={comment.profileImage || '/default_profile.png'}
                alt={comment.nickname}
                className='w-8 h-8 rounded-full mr-2'
              />
              <span className='font-semibold'>{comment.nickname}</span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedTransactionComments;
