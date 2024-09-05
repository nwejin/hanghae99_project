import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value?: boolean) => void;
}

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    (set, get) => ({
      isOpen: true,
      setIsOpen: () => {
        set({ isOpen: !get().isOpen });
      },
      isSearchOpen: false,
      setIsSearchOpen: (value?: boolean) => {
        const isSearchOpen = value !== undefined ? value : !get().isSearchOpen;
        set({
          isSearchOpen,
          isOpen: isSearchOpen ? false : true, // 검색창 열리면 사이드바 작아지고, 닫히면 커짐
        });
      },
    }),
    // 사이드바 상태 로컬스토리지 저장
    {
      name: 'sidebarOpen',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
