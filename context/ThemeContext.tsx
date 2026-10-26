// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ModeTema = "terang" | "gelap";

const lightColors = {
  background: "#f8fafc",
  cardBg: "#ffffff",
  text: "#0f172a",
  subtext: "#64748b",
  border: "#e2e8f0",
  primary: "#0284c7",
  danger: "#ef4444",
};

const darkColors = {
  background: "#0f172a",
  cardBg: "#1e293b",
  text: "#f8fafc",
  subtext: "#94a3b8",
  border: "#334155",
  primary: "#38bdf8",
  danger: "#f87171",
};

interface ThemeContextType {
  modeTema: ModeTema;
  setModeTema: (mode: ModeTema) => void;
  isDark: boolean;
  themeColors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType>({
  modeTema: "terang",
  setModeTema: () => {},
  isDark: false,
  themeColors: lightColors,
});

const KUNCI_TEMA_STORAGE = "@jelajah_aman_mode_tema";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modeTema, setModeTemaState] = useState<ModeTema>("terang");

  useEffect(() => {
    AsyncStorage.getItem(KUNCI_TEMA_STORAGE).then((val) => {
      // nilai lama "sistem" otomatis diabaikan, tetap pakai default "terang"
      if (val === "terang" || val === "gelap") setModeTemaState(val);
    });
  }, []);

  const setModeTema = (mode: ModeTema) => {
    setModeTemaState(mode);
    AsyncStorage.setItem(KUNCI_TEMA_STORAGE, mode);
  };

  const isDark = modeTema === "gelap";
  const themeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ modeTema, setModeTema, isDark, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);