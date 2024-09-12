import create from 'zustand';

interface SignUpState {
  name: string;
  phone_number: string;
  age: number;
  gender: number | null;
  password: string;
  setSignUpData: (data: Partial<SignUpState>) => void;
}

// Zustand로 상태 관리
const useSignUpStore = create<SignUpState>((set) => ({
  name: '',
  phone_number: '',
  auth_code: '',
  age: 0,
  gender: null,
  password: '',
  setSignUpData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),
}));

export default useSignUpStore;
