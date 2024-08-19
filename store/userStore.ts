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
    // 사용자 정보를 세션 스토리지에 저장
    if (user) {
      sessionStorage.setItem('auth', JSON.stringify(user.email));
    } else {
      sessionStorage.removeItem('auth');
    }
  },
}));

const storedUser = sessionStorage.getItem('user');
if (storedUser) {
  userStore.getState().setUser(JSON.parse(storedUser));
}

// 파이어베이스 로그인 여부
onAuthStateChanged(auth, (user) => {
  userStore.getState().setUser(user);
});
