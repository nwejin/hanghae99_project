import { create } from 'zustand';

interface ModalStore {
  modal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modal: false,
  openModal: () => set((state) => ({ modal: !state.modal })),
  closeModal: () =>
    set({
      modal: false,
    }),
}));

export default useModalStore;
