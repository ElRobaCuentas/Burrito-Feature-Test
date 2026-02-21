import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false, // Inicia en blanco por defecto
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));