import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void; // 👈 Nueva función
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false, 
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setTheme: (isDark) => set({ isDarkMode: isDark }), // 👈 Permite forzar el color
}));