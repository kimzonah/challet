// useAccountStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountInfo {
  id: number;
  accountNumber: string;
  accountBalance: number;
}

interface AccountState {
  accountInfo: AccountInfo | null;
  setAccountInfo: (info: AccountInfo) => void;
}

const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      accountInfo: null,
      setAccountInfo: (info) => set({ accountInfo: info }),
    }),
    {
      name: 'account-storage', // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // 로컬 스토리지에 저장
    }
  )
);

export default useAccountStore;
