import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SignUpState {
  name: string;
  phoneNumber: string;
  age: number;
  gender: number | null;
  password: string;
  nickname: string;
  setSignUpData: (data: Partial<SignUpState>) => void;
}

const useSignUpStore = create<SignUpState>()(
  persist(
    (set) => ({
      name: '',
      phoneNumber: '',
      age: 0,
      gender: null,
      password: '',
      nickname: '',
      setSignUpData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'signUp-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // JSON 스토리지를 localStorage로 생성
    }
  )
);

export default useSignUpStore;
