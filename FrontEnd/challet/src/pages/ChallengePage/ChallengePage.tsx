import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import ChallengeForm from '../../components/Challenge/ChallengeForm';
import CategoryList from '../../components/Challenge/CategoryList';
// import ChallengeList from '../../components/Challenge/ChallengeList';


const ChallengePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('챌린지 찾기'); // 기본 활성화된 탭
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const tabs = [
    { label: '챌린지 찾기' },
    { label: '나의 챌린지' },
  ];

  // 탭 전환 함수
  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    setIsLoading(true); // 로딩 시작

    // 로딩 시뮬레이션 (1초)
    setTimeout(() => {
      setIsLoading(false); // 로딩 완료
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* 탭 버튼 목록 */}
      <div className="flex justify-center w-full mb-4 mt-8">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.label)}
            className={`flex-grow w-full px-4 py-2 text-center bg-white ${
              activeTab === tab.label
                ? 'border-b-2 border-teal-500'
                : 'border-b-2 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 로딩 상태일 때 로딩 애니메이션 표시 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        // 로딩이 완료되면 내용 표시
        <div className="w-full">
          {activeTab === '챌린지 찾기' && (
            <div>
              <CategoryList />
              {/* <ChallengeForm /> */}
              {/* <ChallengeList /> */}
              <button
                onClick={() => navigate('/challet-service/challenges/1')}
                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
              >
                <span>1번 챌린지</span>
              </button>
            </div>
          )}

          {activeTab === '나의 챌린지' && (
            <div>
              나의 챌린지를 선택했습니다. 여기에 나의 챌린지 목록을 추가할 수 있습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
