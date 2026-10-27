// components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const { themeColors, isDark } = useTheme();
  const [teks, setTeks] = useState("");
  const [fokus, setFokus] = useState(false);

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={themeColors.subtext}
        selectionColor={themeColors.primary}
        keyboardAppearance={isDark ? "dark" : "light"}
        value={teks}
        onChangeText={handleChange}
        onFocus={() => setFokus(true)}
        onBlur={() => setFokus(false)}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: fokus ? 2 : 1,
          borderColor: fokus ? themeColors.primary : themeColors.border,
          backgroundColor: themeColors.cardBg,
          color: themeColors.text,
          padding: 8,
          borderRadius: 8,
          fontSize: 16,
          // hilangkan garis fokus putih bawaan browser di web
          ...({ outlineStyle: "none" } as object),
        }}
      />
    </View>
  );
}