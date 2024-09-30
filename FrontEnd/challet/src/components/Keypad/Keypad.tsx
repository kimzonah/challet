import { useState, useCallback, useEffect } from 'react';
import { FaBackspace } from 'react-icons/fa'; // 아이콘을 추가합니다.
import './Keypad.css'; // CSS 파일을 임포트합니다.

interface KeypadProps {
  onPinChange: (pin: string) => void;
  maxLength?: number;
  onComplete?: () => void; // 비밀번호 입력 완료 시 호출되는 함수
}

const Keypad = ({ onPinChange, maxLength = 6, onComplete }: KeypadProps) => {
  const [pin, setPin] = useState<string>(''); // 현재 입력된 비밀번호
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]); // 랜덤으로 섞인 키패드 숫자

  // 숫자를 무작위로 섞는 함수
  const shuffleKeys = useCallback(() => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const shuffled = [...keys].sort(() => Math.random() - 0.5); // 무작위로 섞기
    setShuffledKeys(shuffled);
  }, []);

  // 컴포넌트가 마운트될 때 키패드를 섞음
  useEffect(() => {
    shuffleKeys(); // 컴포넌트가 처음 렌더링될 때 키패드 숫자 섞기
  }, [shuffleKeys]);

  // 비밀번호 입력 처리
  const handleInputPin = useCallback(
    (value: string) => {
      if (pin.length < maxLength) {
        const newPin = pin + value;
        setPin(newPin);
        onPinChange(newPin); // 비밀번호 변경을 상위 컴포넌트에 전달

        // 6자리 비밀번호가 입력되면 onComplete가 있으면 호출
        if (newPin.length === maxLength && onComplete) {
          onComplete(); // onComplete가 있을 때만 호출
        }
      }
    },
    [pin, maxLength, onPinChange, onComplete]
  );

  // 한 글자 삭제
  const handleDelete = useCallback(() => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    onPinChange(newPin); // 변경된 비밀번호를 상위 컴포넌트에 전달
  }, [pin, onPinChange]);

  // 전체 삭제
  const handleClear = useCallback(() => {
    setPin('');
    onPinChange(''); // 비밀번호를 완전히 삭제하여 상위 컴포넌트에 전달
  }, [onPinChange]);

  return (
    <>
      {/* 비밀번호 표시 */}
      <div className='pin-display-container'>
        {[...Array(maxLength)].map((_, i) => (
          <span
            key={i}
            className={`pin-circle ${pin[i] ? 'filled' : 'empty'}`}
          ></span>
        ))}
      </div>

      <div className='keypad-container'>
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
                  className='keypad'
                  onClick={() => handleInputPin(shuffledKeys[9])}
                >
                  {shuffledKeys[9]}
                </button>
              </td>
              <td>
                <button className='keypad-button' onClick={handleDelete}>
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
