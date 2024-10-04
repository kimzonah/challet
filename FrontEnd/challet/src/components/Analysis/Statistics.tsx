// Statistics.tsx
import { useEffect } from 'react';
import { useStatisticsApi } from '../../hooks/statisticsApi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Statistics = () => {
  const { statistics, isLoading, fetchStatistics, nickname, fetchUserData } =
    useStatisticsApi();

  useEffect(() => {
    fetchStatistics();
    fetchUserData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // 데이터가 없는 경우 처리
  if (statistics.length === 0) {
    return <p>소비 내역이 없습니다.</p>;
  }

  const data = statistics; // 이미 categoryList를 추출했으므로 그대로 사용

  // 차트 색상 배열
  const COLORS = ['#00CCCC', '#E24D42', '#EAB839', '#7EB26D', '#7B61FF'];

  // 카테고리 한글 변환
  const categoryMap: { [key: string]: string } = {
    SHOPPING: '쇼핑',
    COFFEE: '커피',
    ETC: '기타 비용',
    TRANSPORT: '교통비',
    DELIVERY: '배달비',
  };

  return (
    <div className='flex flex-col items-center'>
      {/* 사용자 설명 텍스트 */}
      <div className='mb-6 text-center p-4 '>
        <div className='text-xl'>
          <div className='mb-2'>
            <span className='text-[#00CCCC]'>{nickname}</span>
            <span>&nbsp;님과 비슷한</span>
          </div>
          <span> 연령대가 지난 달에 소비한 내역은?</span>
        </div>
      </div>

      {/* SVG 필터 정의 */}
      <svg width='0' height='0'>
        <defs>
          <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>
            <feDropShadow
              dx='3'
              dy='3'
              stdDeviation='3'
              floodColor='rgba(0, 0, 0, 0.5)'
            />
          </filter>
        </defs>
      </svg>

      {/* 원형 차트 및 범례 */}
      <div
        style={{ width: '100%', height: 200 }}
        className='flex justify-center items-center'
      >
        <ResponsiveContainer width='50%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              dataKey='percentage'
              nameKey='category'
              cx='50%'
              cy='50%'
              fill='#00CCCC'
              labelLine={false} // 작대기(레이블 연결선) 비활성화
              // SVG 필터 적용
              style={{ filter: 'url(#shadow)' }}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, categoryMap[name as string]]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 범례 */}
        <div className='ml-4'>
          <ul className='space-y-2'>
            {data.map((entry, index) => (
              <li key={`legend-${index}`} className='flex items-center'>
                <div
                  className='w-3 h-3 mr-2'
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {/* 한글 카테고리명 출력 */}
                <span>{categoryMap[entry.category]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 설명 텍스트 */}
      <div className='mt-6 p-4 rounded-lg shadow-md bg-[#F1F4F6] text-center text-sm'>
        <p>
          <span className='text-[#00CCCC] font-bold'>20대 여성</span>의 소비
          패턴으로는 현재 배달비 다음으로 식비가 많습니다!
        </p>
      </div>
    </div>
  );
};

export default Statistics;
