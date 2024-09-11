import React from 'react';

interface CategoryProps {
  icon: string;
  label: string;
  isActive: boolean;
}

const Category: React.FC<CategoryProps> = ({ icon, label, isActive }) => {
  const borderClass = isActive ? 'border-2 border-teal-500 border-solid' : '';
  const textColorClass = isActive ? 'text-teal-500' : 'text-zinc-400';

  return (
    <div className='flex flex-col flex-1'>
      <div
        className={`flex flex-col justify-center items-center px-2.5 bg-gray-100 rounded-full h-[60px] w-[60px] ${borderClass}`}
      >
        <img
          loading='lazy'
          src={icon}
          alt={`${label} icon`}
          className='object-contain w-10 aspect-square'
        />
      </div>
      <div
        className={`self-center text-sm font-medium tracking-wider text-center ${textColorClass}`}
      >
        {label}
      </div>
    </div>
  );
};

const CategoryList: React.FC = () => {
  const categories = [
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/94d3656e83bbb171252292737a504ea9868aafdcac2c8be96438d9a3eaeae764?placeholderIfAbsent=true&apiKey=656f776864a74c6a987a4837913d3a96',
      label: '전체',
      isActive: true,
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/5bff82b392fbf0ddd0121ede5d1d8229b97590ad0deda084fe3939a26f23191a?placeholderIfAbsent=true&apiKey=656f776864a74c6a987a4837913d3a96',
      label: '배달',
      isActive: false,
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/22d57a3dcb6d86b904030ce7964d0c580b721436ef5790aa433c16a206649f66?placeholderIfAbsent=true&apiKey=656f776864a74c6a987a4837913d3a96',
      label: '교통',
      isActive: false,
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ea0b4eee14033226b22e944ea5f5a303dc418308da18d60717749bd4e663b80f?placeholderIfAbsent=true&apiKey=656f776864a74c6a987a4837913d3a96',
      label: '생활',
      isActive: false,
    },
  ];

  return (
    <div className='flex overflow-hidden gap-6 px-6 py-2.5 mt-3.5 bg-white'>
      {categories.map((category, index) => (
        <Category key={index} {...category} />
      ))}
    </div>
  );
};

export default CategoryList;
