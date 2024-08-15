import { create } from 'zustand';

interface emailStore {
  email: String;
  setEmail: (value: string) => void;
}

export const useEmailStore = create<emailStore>((set, get) => ({
  email: '',
  setEmail: (value: string) =>
    set({
      email: value,
    }),
}));

export default useEmailStore;
