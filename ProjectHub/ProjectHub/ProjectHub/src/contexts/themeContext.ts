import { createContext } from 'react';
import { webLightTheme } from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: webLightTheme,
  themeMode: 'light',
  toggleTheme: () => {},
});
