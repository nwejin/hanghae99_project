import { create } from 'zustand';

interface TestStore {
  A: number;
  B: number;
  increseA: () => void;
  increseB: (value: number) => void;
  testText: string;
  setData: (value: string) => void;
}

const useTestStore = create<TestStore>()((set, get) => ({
  A: 0, // store state
  B: 0, // store state
  // numberA 증가 함수
  testText: '',
  increseA: () =>
    set((state) => ({
      A: state.A + 1, // state를 이용하여 state 값 변경
    })),
  // numberB 증가 함수
  increseB: (value: number) =>
    set({
      B: get().B + value, // get을 이용하여 state 값 변경
    }),
  setData: (value: string) =>
    set({
      testText: value,
    }),
}));

export default useTestStore;
