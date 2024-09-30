import { useEffect, useState } from 'react';
import { useChallengeApi } from '../../hooks/useChallengeApi';

interface Comment {
  nickname: string;
  profileImage: string;
  content: string;
}

const SharedTransactionComments = ({
  sharedTransactionId,
  refreshComments, // 새로고침을 위한 상태 추가
}: {
  sharedTransactionId: number;
  refreshComments: boolean; // 새로고침 상태를 prop으로 받음
}) => {
  const { fetchTransactionComments } = useChallengeApi();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      // 댓글 데이터를 가져오는 API 요청
      const fetchedComments =
        await fetchTransactionComments(sharedTransactionId);
      setComments(fetchedComments);
    };

    fetchComments();
  }, [sharedTransactionId, refreshComments, fetchTransactionComments]); // refreshComments가 변경될 때마다 새로 불러오기

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
