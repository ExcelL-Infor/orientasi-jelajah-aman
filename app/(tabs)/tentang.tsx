// app/(tabs)/tentang.tsx
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";
import { useTheme } from "../../context/ThemeContext";

export default function TabTentang() {
  const { themeColors } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: spacing.sedang,
        backgroundColor: themeColors.background,
      }}
    >
      <Text
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          marginBottom: spacing.kecil,
          color: themeColors.text,
        }}
        accessibilityLabel="Judul Halaman: Tentang Aplikasi Jelajah Aman"
      >
        Jelajah Aman
      </Text>
      <Text
        style={{
          fontSize: typeScale.isi,
          marginBottom: spacing.kecil,
          color: themeColors.subtext,
        }}
      >
        Versi 1.0.0
      </Text>
      <Text style={{ fontSize: typeScale.isi, color: themeColors.text }}>
        Dibuat oleh: Andika Faza Setiawan
      </Text>
    </SafeAreaView>
  );
}