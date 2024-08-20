import { create } from 'zustand';

interface UserStore {
  user: string;
  setUser: (user: string) => void;
}

// uid 저장
export const userStore = create<UserStore>((set) => ({
  user: '',
  setUser: (user: string) => {
    set({ user });
  },
}));
