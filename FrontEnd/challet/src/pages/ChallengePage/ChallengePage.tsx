import { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryList from '../../components/Challenge/CategoryList';

const ChallengePage = () => {
  const [activeTab, setActiveTab] = useState('챌린지 찾기'); // 기본 활성화된 탭
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [keyword] = useState('null'); // 기본 keyword
  const [category] = useState('null'); // 기본 category

  const tabs = [{ label: '챌린지 찾기' }, { label: '나의 챌린지' }];

  // 탭 전환 함수
  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    setIsLoading(true); // 로딩 시작
  };

  // 탭 전환 시 API 요청
  useEffect(() => {
    if (activeTab === '챌린지 찾기') {
      // 챌린지 찾기 API 요청 (axios 사용)
      axios
        .get(`/challet-service/challenges`, {
          params: {
            keyword: keyword,
            category: category,
          },
        })
        .then((response) => {
          console.log('챌린지 찾기 응답 데이터:', response.data);
          setIsLoading(false); // 로딩 완료
        })
        .catch((error) => {
          console.error('챌린지 찾기 API 호출 중 오류 발생:', error);
          setIsLoading(false);
        });
    } else if (activeTab === '나의 챌린지') {
      // 나의 챌린지 API 요청 (axios 사용)
      axios
        .get('/challet-service/challenges/my-challenges')
        .then((response) => {
          console.log('나의 챌린지 응답 데이터:', response.data);
          setIsLoading(false); // 로딩 완료
        })
        .catch((error) => {
          console.error('나의 챌린지 API 호출 중 오류 발생:', error);
          setIsLoading(false);
        });
    }
  }, [activeTab, keyword, category]);

  return (
    <div className='min-h-screen flex flex-col items-center p-2'>
      {/* 탭 버튼 목록 */}
      <div className='flex justify-center w-full mb-2 mt-8'>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.label)}
            className={`flex-grow w-full px-4 py-2 text-center bg-white ${
              activeTab === tab.label
                ? 'border-b-2 border-teal-500'
                : 'border-b-2 border-inherit'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 로딩 상태일 때 로딩 애니메이션 표시 */}
      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500'></div>
        </div>
      ) : (
        // 로딩이 완료되면 내용 표시
        <div className='w-full'>
          {activeTab === '챌린지 찾기' && (
            <div>
              <CategoryList />
            </div>
          )}

          {activeTab === '나의 챌린지' && (
            <div>
              나의 챌린지를 선택했습니다. 여기에 나의 챌린지 목록을 추가할 수
              있습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
