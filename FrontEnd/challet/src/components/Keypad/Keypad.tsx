import React from 'react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onClear: () => void; // 전체 삭제 버튼 처리 함수
  onBackspace: () => void; // 한 글자 삭제 버튼 처리 함수
}

const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  onClear,
  onBackspace,
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className='flex flex-wrap rounded-xl bg-gray-300 max-w-sm mx-auto mt-24'>
      {keys.map((key) => (
        <div className='w-1/3' key={key}>
          <button
            className='w-full h-20 text-2xl text-gray-700 font-bold rounded-xl hover:bg-gray-400'
            onClick={() => onKeyPress(key)}
          >
            {key}
          </button>
        </div>
      ))}
      <div className='w-1/3'>
        <button
          className='w-full h-20 text-2xl text-gray-700 font-bold rounded-xl hover:bg-red-400'
          onClick={onClear}
        >
          전체 삭제
        </button>
      </div>
      <div className='w-1/3'>
        <button
          className='w-full h-20 text-2xl text-gray-700 font-bold rounded-xl hover:bg-blue-400'
          onClick={onBackspace}
        >
          한 글자 삭제
        </button>
      </div>
    </div>
  );
};

export default Keypad;
