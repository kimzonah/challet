import React, { useState } from 'react';
import AllSearch from '../../assets/Challenge/Search.png';
import Delivery from '../../assets/Challenge/Motorcycle_Delivery.png';
import Car from '../../assets/Challenge/Car.png';
import Coffee from '../../assets/Challenge/Coffee.png';
import shopping from '../../assets/Challenge/Shopping.png';

interface CategoryProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: (label: string) => void;
}

function Category({ icon, label, isActive, onClick }: CategoryProps) {
  const borderClass = isActive ? 'border-2 border-teal-500 border-solid' : '';
  const textColorClass = isActive ? 'text-teal-500' : 'text-zinc-400';

  return (
    <button
      onClick={() => onClick(label)}
      className="flex flex-col items-center bg-white"
    >
      <div
        className={`flex justify-center items-center bg-gray-100 rounded-full ${borderClass}`}
      >
        <img
          loading="lazy"
          src={icon}
          alt={`${label} icon`}
          className="object-contain w-full"
        />
      </div>
      <div className="pb-1"></div>
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

  const categories = [
    {
      icon: AllSearch,
      label: '전체',
      isActive: activeCategory === '전체',
    },
    {
      icon: Delivery,
      label: '배달',
      isActive: activeCategory === '배달',
    },
    {
      icon: Coffee,
      label: '커피',
      isActive: activeCategory === '커피',
    },
    {
      icon: Car,
      label: '교통',
      isActive: activeCategory === '교통',
    },
    {
      icon: shopping,
      label: '생활',
      isActive: activeCategory === '생활',
    },
  ];

  const handleCategoryClick = (label: string) => {
    setActiveCategory(label);
    console.log(`${label} 카테고리 선택됨`);
  };

  return (
    <div className="flex overflow-x-auto gap-6 bg-white scrollbar-hide"> {/* X축 오버플로우 활성화 */}
      {categories.map((category, index) => (
        <Category
          key={index}
          {...category}
          onClick={handleCategoryClick}
        />
      ))}
    </div>
  );
}

export default CategoryList;
