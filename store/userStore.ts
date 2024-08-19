import { create } from 'zustand';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const userStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User | null) => {
    set({ user });
  },
}));
