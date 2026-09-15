// app/(tabs)/tentang.tsx
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ flex: 1, padding: spacing.sedang }}>
      <Text 
        style={{ fontSize: typeScale.judul, fontWeight: "bold", marginBottom: spacing.kecil }}
        accessibilityLabel="Judul Halaman: Tentang Aplikasi Jelajah Aman"
      >
        Jelajah Aman
      </Text>
      <Text style={{ fontSize: typeScale.isi, marginBottom: spacing.kecil }}>
        Versi 1.0.0
      </Text>
      <Text style={{ fontSize: typeScale.isi }}>
        Dibuat oleh: Nama Kamu Disini
      </Text>
    </SafeAreaView>
  );
}