// AverageStatistics.tsx
import { useEffect } from 'react';
import { useStatisticsApi } from '../../hooks/statisticsApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AverageStatistics = () => {
  const {
    AverageStatistics,
    myStatistics,
    isLoading,
    age,
    gender,
    fetchStatistics,
  } = useStatisticsApi();

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // 데이터가 없는 경우 처리
  if (AverageStatistics.length === 0 || myStatistics.length === 0) {
    return <p>평균 소비 내역이 없습니다.</p>;
  }

  // 카테고리 한글 변환
  const categoryMap: { [key: string]: string } = {
    SHOPPING: '쇼핑',
    COFFEE: '커피',
    ETC: '기타 비용',
    TRANSPORT: '교통비',
    DELIVERY: '배달비',
  };

  // 내 소비습관과 평균 소비습관을 비교하기 위해 데이터를 매핑
  const comparisonData = myStatistics.map((myStat) => {
    const averageStat = AverageStatistics.find(
      (avgStat) => avgStat.category === myStat.category
    );
    return {
      category: categoryMap[myStat.category] || myStat.category, // 한글 변환
      myPercentage: myStat.percentage,
      averagePercentage: averageStat ? averageStat.percentage : 0,
    };
  });

  return (
    <div className='flex flex-col items-center'>
      {/* 설명 텍스트 */}
      <div className='mb-6 text-center p-4 '>
        <div className='text-xl'>
          <div className='mb-2'>
            <span className='text-[#00CCCC]'>
              {age}대 {gender}
            </span>
            <span>&nbsp;소비 패턴과 비교한 결과는?</span>
          </div>
        </div>
      </div>

      {/* 막대 차트 */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={comparisonData} layout='vertical'>
            <XAxis type='number' />
            <YAxis type='category' dataKey='category' />
            <Tooltip />
            <Legend />
            <Bar dataKey='myPercentage' fill='#00CCCC' name='나의 소비' />
            <Bar dataKey='averagePercentage' fill='#FF8042' name='평균 소비' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageStatistics;
