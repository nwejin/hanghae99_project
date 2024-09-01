import { create } from 'zustand';

interface PetState {
  petName: string | null;
  petSpecies: string | null;
  petSubSpecies?: string | null;
  petImage?: string | null;
}

interface UserState {
  userId: string | null;
  setUserId: (useId: string) => void;
  email: string | null;
  setEmail: (email: string) => void;
  nickName: string | null;
  setNickName: (nickName: string) => void;
  profileImg: string | null;
  setProfileImg: (ProfileImg: string) => void;
  petInfo: PetState | null;
  setPetInfo: (petInfo: PetState) => void;
  clearUser: () => void;
}

export const userStore = create<UserState>((set) => ({
  userId: JSON.parse(sessionStorage.getItem('userId') || 'null'),
  email: JSON.parse(sessionStorage.getItem('email') || 'null'),
  nickName: JSON.parse(sessionStorage.getItem('nickName') || 'null'),
  profileImg: JSON.parse(sessionStorage.getItem('profileImg') || 'null'),
  petInfo: JSON.parse(sessionStorage.getItem('petInfo') || 'null'),
  setUserId: (userId) => {
    sessionStorage.setItem('userId', JSON.stringify(userId));
    set({ userId });
  },
  setEmail: (email) => {
    sessionStorage.setItem('email', JSON.stringify(email));
    set({ email });
  },
  setNickName: (nickName) => {
    sessionStorage.setItem('nickName', JSON.stringify(nickName));
    set({ nickName });
  },
  setProfileImg: (profileImg) => {
    sessionStorage.setItem('profileImg', JSON.stringify(profileImg));
    set({ profileImg });
  },
  setPetInfo: (petInfo) => {
    sessionStorage.setItem('petInfo', JSON.stringify(petInfo));
    set({ petInfo });
  },
  clearUser: () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('nickName');
    sessionStorage.removeItem('profileImg');
    sessionStorage.removeItem('petInfo');
    set({
      userId: null,
      email: null,
      nickName: null,
      profileImg: null,
      petInfo: null,
    });
  },
}));
