import { useState, ChangeEvent, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { TopBar } from '../topbar/topbar';

interface RequestBody {
  category: string;
  title: string;
  spendingLimit: number;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  isPublic: boolean;
}

const ChallengeCreatePage: React.FC = () => {
  // 각 입력 필드의 상태를 관리
  const [category, setCategory] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [spendingLimit, setSpendingLimit] = useState<string>('');
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]); // 시작 및 종료 날짜를 배열로 관리
  const [maxParticipants, setMaxParticipants] = useState<string>('1'); // 기본값 1명
  const [isPublic, setIsPublic] = useState<boolean>(true); // 기본값을 공개로 설정
  const [startDate, endDate] = dateRange;

  // 카테고리 및 입력 필드의 값 변경 핸들러
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  // 폼 제출 시 데이터 처리
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert('시작 날짜와 종료 날짜를 선택하세요.');
      return;
    }

    const requestBody: RequestBody = {
      category,
      title: roomName,
      spendingLimit: Number(spendingLimit),
      startDate: startDate.toISOString().split('T')[0], // ISO 문자열을 YYYY-MM-DD로 변환
      endDate: endDate.toISOString().split('T')[0],
      maxParticipants: Number(maxParticipants),
      isPublic,
    };

    console.log('RequestBody:', requestBody);

    // 여기에 서버로 데이터를 보내는 로직 추가 (예: fetch 또는 axios)
  };

  // 오늘 날짜 + 1 (내일) 계산
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div>
      <TopBar title='챌린지를 만들어볼까요?' />
      <div className='pt-[80px] px-6'>
        <form onSubmit={handleSubmit}>
          {/* 카테고리 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>주제</label>
            <select
              className='w-[300px] py-4 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2'
              value={category}
              onChange={handleInputChange(setCategory)}
            >
              <option value='' disabled>
                카테고리
              </option>
              <option value='DELIVERY'>배달</option>
              <option value='COFFEE'>커피</option>
              <option value='TRANSPORT'>교통</option>
              <option value='SHOPPING'>쇼핑</option>
            </select>
          </div>

          {/* 방 이름 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              방 이름
            </label>
            <input
              type='text'
              value={roomName}
              maxLength={15}
              onChange={handleInputChange(setRoomName)}
              className='w-[300px] py-4 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2'
              placeholder='방 이름 (최대 15자)'
            />
          </div>

          {/* 지출 한도 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              지출 한도
            </label>
            <input
              type='number'
              value={spendingLimit}
              onChange={handleInputChange(setSpendingLimit)}
              className='w-[300px] py-4 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2'
              placeholder='지출 한도를 입력하세요'
            />
          </div>

          {/* 시작 날짜 및 종료 날짜 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              기간 선택
            </label>
            <DatePicker
              selected={startDate}
              onChange={(update: [Date | null, Date | null]) =>
                setDateRange([update[0] || undefined, update[1] || undefined])
              } // 날짜 범위 업데이트 및 null 처리
              startDate={startDate}
              endDate={endDate}
              selectsRange={true} // 시작 날짜와 종료 날짜를 동시에 선택
              minDate={tomorrow} // 시작 날짜를 내일부터 선택 가능
              locale={ko}
              dateFormat='yyyy년 MM월 dd일'
              placeholderText='시작 날짜 ~ 종료 날짜'
              className='w-[300px] py-2 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500'
            />
          </div>

          {/* 최대 참가자 수 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              최대 참가자 수
            </label>
            <select
              value={maxParticipants}
              onChange={handleInputChange(setMaxParticipants)}
              className='w-[300px] py-4 rounded-lg text-gray-500 bg-[#F1F4F6] focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2'
            >
              {[...Array(30).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}명
                </option>
              ))}
            </select>
          </div>

          {/* 공개 여부 */}
          <div>
            <label className='flex text-sm font-semibold mb-2 ml-2'>
              공개 여부
            </label>
            <div className='flex space-x-4 justify-center'>
              <button
                type='button'
                className={`w-[140px] py-4 rounded-lg text-white ${
                  isPublic ? 'bg-[#00CCCC]' : 'bg-gray-400'
                }`}
                onClick={() => setIsPublic(true)}
              >
                공개
              </button>
              <button
                type='button'
                className={`w-[140px] py-4 rounded-lg text-white ${
                  !isPublic ? 'bg-[#00CCCC]' : 'bg-gray-400'
                }`}
                onClick={() => setIsPublic(false)}
              >
                비공개
              </button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type='submit'
            className='w-[300px] py-4 bg-[#00CCCC] text-white rounded-lg hover:bg-teal-600 mt-6 mb-6'
          >
            챌린지 생성하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChallengeCreatePage;
