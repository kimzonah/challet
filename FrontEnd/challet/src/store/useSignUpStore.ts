import { create } from 'zustand';

// SignUpState 인터페이스 정의
interface SignUpState {
  name: string;
  phoneNumber: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | null; // 성별을 직접 인터페이스에서 정의
  password: string;
  nickname: string;
  setSignUpData: (data: Partial<SignUpState>) => void;
}

// Zustand로 상태 관리
const useSignUpStore = create<SignUpState>((set) => ({
  name: '',
  phoneNumber: '',
  age: 0,
  gender: null, // 초기값은 null
  password: '',
  nickname: '',
  setSignUpData: (data) =>
    set((state) => ({
      ...state,
      ...data, // 새로운 데이터로 상태 업데이트
    })),
}));

export default useSignUpStore;
