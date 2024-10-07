import { useState, useCallback, useEffect } from 'react';
import { FaBackspace } from 'react-icons/fa';
import './Keypad.css';

interface KeypadProps {
  onPinChange: (pin: string) => void;
  maxLength?: number;
  onComplete?: () => void;
}

const Keypad = ({ onPinChange, maxLength = 6, onComplete }: KeypadProps) => {
  const [pin, setPin] = useState<string>('');
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]);

  // 숫자를 무작위로 섞는 함수
  const shuffleKeys = useCallback(() => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const shuffled = [...keys].sort(() => Math.random() - 0.5);
    setShuffledKeys(shuffled);
  }, []);

  useEffect(() => {
    shuffleKeys();
  }, [shuffleKeys]);

  const handleInputPin = useCallback(
    (value: string) => {
      if (pin.length < maxLength) {
        const newPin = pin + value;
        setPin(newPin);
        onPinChange(newPin);

        if (newPin.length === maxLength && onComplete) {
          onComplete();
        }
      }
    },
    [pin, maxLength, onPinChange, onComplete]
  );

  const handleDelete = useCallback(() => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    onPinChange(newPin);
  }, [pin, onPinChange]);

  const handleClear = useCallback(() => {
    setPin('');
    onPinChange('');
  }, [onPinChange]);

  return (
    <>
      <div className='keypad-container fixed bottom-0 w-full bg-white'>
        {/* 비밀번호 표시 */}
        <div className='pin-display-container absolute top-[-30%] left-1/2 transform -translate-x-1/2'>
          {[...Array(maxLength)].map((_, i) => (
            <span
              key={i}
              className={`pin-circle ${pin[i] ? 'filled' : 'empty'}`}
            ></span>
          ))}
        </div>
        {/* 키패드 렌더링 */}
        <table className='SecureKeyboard_keyboard' role='presentation'>
          <tbody>
            <tr>
              {shuffledKeys.slice(0, 3).map((key) => (
                <td key={key}>
                  <button
                    className='keypad-button'
                    onClick={() => handleInputPin(key)}
                  >
                    {key}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              {shuffledKeys.slice(3, 6).map((key) => (
                <td key={key}>
                  <button
                    className='keypad-button'
                    onClick={() => handleInputPin(key)}
                  >
                    {key}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              {shuffledKeys.slice(6, 9).map((key) => (
                <td key={key}>
                  <button
                    className='keypad-button'
                    onClick={() => handleInputPin(key)}
                  >
                    {key}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <button className='keypad-button' onClick={handleClear}>
                  전체삭제
                </button>
              </td>
              <td>
                <button
                  className='keypad-button'
                  onClick={() => handleInputPin(shuffledKeys[9])}
                >
                  {shuffledKeys[9]}
                </button>
              </td>
              <td>
                <button
                  className='keypad-button flex justify-center items-center'
                  onClick={handleDelete}
                >
                  <FaBackspace size={24} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Keypad;
