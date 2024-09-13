import { useEffect, useState } from 'react';
import CategoryList from '../../components/Challenge/CategoryList';
import ChallengeForm from '../../components/Challenge/ChallengeForm';
import { useChallengeApi } from '../../hooks/useChallengeApi';

const ChallengePage = () => {
  const [activeTab, setActiveTab] = useState('챌린지 찾기'); // 기본 활성화된 탭
  const { challenges, isLoading, fetchChallenges } = useChallengeApi();
  const [keyword, setKeyword] = useState(''); // 검색 키워드
  const [category, setCategory] = useState(''); // 선택된 카테고리

  const exampleChallenges = [
    {
      status: 'RECRUITING',
      isIncluded: false,
      category: 'COFFEE',
      title: '커피 대신 물 마시기',
      spendingLimit: 10000,
      startDate: '2023-09-20',
      endDate: '2023-09-30',
      maxParticipants: 10,
      currentParticipants: 5,
      isPublic: true,
      inviteCode: null,
    },
    {
      status: 'PROGRESSING',
      isIncluded: true,
      category: 'DELIVERY',
      title: '배달 음식 절반 줄이기',
      spendingLimit: 50000,
      startDate: '2023-08-15',
      endDate: '2023-09-15',
      maxParticipants: 20,
      currentParticipants: 18,
      isPublic: false,
      inviteCode: 'ABC123',
    },
    {
      status: 'END',
      isIncluded: true,
      category: 'SHOPPING',
      title: '한달 쇼핑 멈추기 챌린지',
      spendingLimit: 0,
      startDate: '2023-07-01',
      endDate: '2023-07-31',
      maxParticipants: 30,
      currentParticipants: 30,
      isPublic: true,
      inviteCode: null,
    },
  ];

  // 탭 전환 처리
  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    if (tabLabel === '나의 챌린지') {
      fetchChallenges('', '', true); // 나의 챌린지 요청
    }
  };

  // 카테고리 선택 시 호출
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    fetchChallenges(keyword, newCategory);
  };

  // 검색어 변경 시 호출
  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    fetchChallenges(newKeyword, category);
  };

  // 기본 탭이 챌린지 찾기일 때, 처음 로드될 때 챌린지 목록 요청
  useEffect(() => {
    if (activeTab === '챌린지 찾기') {
      fetchChallenges(keyword, category);
    }
  }, [activeTab, keyword, category]);

  // 챌린지 찾기 탭에서는 isIncluded가 false인 챌린지만 필터링
  const filteredChallenges =
    activeTab === '챌린지 찾기'
      ? exampleChallenges.filter((challenge) => !challenge.isIncluded)
      : exampleChallenges;

  return (
    <div className='min-h-screen flex flex-col items-center p-2'>
      <div className='flex justify-center w-full mb-2 mt-8'>
        {['챌린지 찾기', '나의 챌린지'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-grow w-full px-4 py-2 text-center bg-white ${
              activeTab === tab
                ? 'border-b-2 border-teal-500'
                : 'border-b-2 border-inherit'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500'></div>
        </div>
      ) : (
        <div className='w-full'>
          {activeTab === '챌린지 찾기' && (
            <CategoryList
              onCategoryChange={handleCategoryChange}
              onSearch={handleSearch}
            />
          )}
          <ChallengeForm
            challenges={filteredChallenges} // 필터링된 챌린지 목록 전달
            isMyChallenges={activeTab === '나의 챌린지'}
          />
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
