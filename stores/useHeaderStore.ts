import { create } from 'zustand';

interface HeaderStore {
  isHeaderVisible: boolean;
  sheetHeight: number;
  setHeaderVisible: (visible: boolean) => void;
  setSheetHeight: (height: number) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  isHeaderVisible: true,
  sheetHeight: 0,
  setHeaderVisible: (visible) => set({ isHeaderVisible: visible }),
  setSheetHeight: (height) => set({ sheetHeight: height }),
}));
