import { useEffect, useState } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';

interface Comment {
  nickname: string;
  profileImage: string;
  content: string;
}

const SharedTransactionComments = ({
  sharedTransactionId,
}: {
  sharedTransactionId: number;
}) => {
  const { fetchTransactionComments } = useChallengeApi();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      // 실제 API 요청 대신 더미 데이터를 가져옵니다.
      const fetchedComments =
        await fetchTransactionComments(sharedTransactionId);
      setComments(fetchedComments);
    };

    fetchComments();
  }, [sharedTransactionId, fetchTransactionComments]);

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
