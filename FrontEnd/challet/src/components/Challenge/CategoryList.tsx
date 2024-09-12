import { useState, useRef } from 'react';
import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import shopping from '../../assets/Challenge/Shopping.png';
import SearchBar from '../../assets/Challenge/SearchBar.png';
import Timefill from '../../assets/Challenge/Timefill.png';

interface CategoryProps {
  icon: string;
  label: string;
  class: string;
  isActive: boolean;
  onClick: (label: string, className: string) => void;
}

function Category({
  icon,
  label,
  class: className,
  isActive,
  onClick,
}: CategoryProps) {
  const borderClass = isActive ? 'border-2 border-teal-500 border-solid' : '';
  const textColorClass = isActive ? 'text-teal-500' : 'text-zinc-400';

  return (
    <button
      onClick={() => onClick(label, className)}
      className='flex flex-col items-center bg-white'
    >
      <div
        className={`flex justify-center items-center bg-gray-100 rounded-full ${borderClass}`}
        style={{ width: '60px', height: '60px', boxSizing: 'border-box' }} // 이미지 크기 고정 및 border-box 적용
      >
        <img
          loading='lazy'
          src={icon}
          alt={`${label} icon`}
          className='object-contain w-full h-full' // 이미지 크기를 부모 요소에 맞춤
        />
      </div>
      <div className='pb-1'></div>
      <div
        className={`text-sm font-medium tracking-wider text-center ${textColorClass}`}
      >
        {label}
      </div>
    </button>
  );
}

function CategoryList() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [activeClass, setActiveClass] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    {
      icon: AllSearch,
      label: '전체',
      class: '',
      isActive: activeCategory === '전체',
    },
    {
      icon: Delivery,
      label: '배달',
      class: 'DELIVERY',
      isActive: activeCategory === '배달',
    },
    {
      icon: Coffee,
      label: '커피',
      class: 'COFFEE',
      isActive: activeCategory === '커피',
    },
    {
      icon: Car,
      label: '교통',
      class: 'TRANSPORT',
      isActive: activeCategory === '교통',
    },
    {
      icon: shopping,
      label: '쇼핑',
      class: 'SHOPPING',
      isActive: activeCategory === '쇼핑',
    },
  ];

  const handleCategoryClick = (label: string, className: string) => {
    setActiveCategory(label);
    setActiveClass(className);
    console.log(`${label} 카테고리 선택됨`);
  };

  const handleSearchClick = () => {
    const searchTerm = searchInputRef.current?.value || '';
    if (searchTerm.trim() !== '') {
      const apiUrl = `/challet-service/challenges?keyword=${searchTerm}&category=${activeClass}`;
      console.log(`API 호출: ${apiUrl}`);

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('API 응답 데이터:', data);
        })
        .catch((error) => {
          console.error('API 호출 중 오류 발생:', error);
        });
    }
  };

  return (
    <div className='w-full p-4'>
      {/* 검색창 */}
      <div className='flex items-center mb-4'>
        <input
          type='text'
          ref={searchInputRef} // 입력 필드에 대한 참조 생성
          placeholder='관심 있는 키워드'
          className='flex-grow border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#F1F4F6]'
        />
        <button
          onClick={handleSearchClick}
          className='ml-2 bg-white p-2 rounded-full' // 버튼의 백그라운드 색을 white로 설정
        >
          <img src={SearchBar} alt='검색' className='w-8 h-8' />
        </button>
      </div>

      {/* 카테고리 리스트 */}
      <div className='flex overflow-x-auto gap-6 bg-white scrollbar-hide'>
        {categories.map((category, index) => (
          <Category key={index} {...category} onClick={handleCategoryClick} />
        ))}
      </div>

      {/* 챌린지 리스트 예시 */}
      <div className='mt-6'>
        <div className='border rounded-md p-4 mb-4'>
          <div className='flex items-center'>
            <img
              src={Coffee} // 예시로 이미지 사용
              alt='커피 대신 물 마시자'
              className='w-12 h-12 rounded-full'
            />
            <div className='ml-4'>
              <div className='font-bold'>커피 대신 물 마시자</div>
              <div className='text-sm text-gray-500'>5/6명 | 50,000원</div>
              <div className='text-sm text-gray-500'>
                3일 뒤 시작 | 14일 동안
              </div>
            </div>
          </div>
        </div>
        {/* 더 많은 챌린지들을 여기에 추가할 수 있습니다 */}
      </div>
    </div>
  );
}

export default CategoryList;
