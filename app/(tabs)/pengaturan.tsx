// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { useTheme, ModeTema } from "../../context/ThemeContext";

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { modeTema, setModeTema, themeColors } = useTheme();

  async function hapusDataTersimpan() {
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.judul, { color: themeColors.text }]}>Pengaturan & Mode Tampilan</Text>

      {/* Pilihan Tema (Dark / Light Mode) */}
      <View style={[styles.sectionCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Tema Tampilan</Text>

        <View style={styles.opsiContainer}>
          {(["terang", "gelap"] as ModeTema[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.tombolOpsi,
                { borderColor: themeColors.border },
                modeTema === mode && { backgroundColor: themeColors.primary, borderColor: themeColors.primary },
              ]}
              onPress={() => setModeTema(mode)}
            >
              <Text
                style={[
                  styles.teksOpsi,
                  { color: modeTema === mode ? "#ffffff" : themeColors.text },
                ]}
              >
                {mode === "terang" ? "Terang" : "Gelap"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Manajemen Cache */}
      <View style={[styles.sectionCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Penyimpanan Cache</Text>
        <Button title="Hapus Semua Data Cuaca Tersimpan" onPress={hapusDataTersimpan} color={themeColors.danger} />
        {pesan && <Text style={{ color: themeColors.subtext, marginTop: 8 }}>{pesan}</Text>}
      </View>

      <Text style={[styles.versiText, { color: themeColors.subtext }]}>Jelajah Aman Versi 1.0.0 (UTS)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  judul: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  sectionCard: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  opsiContainer: { flexDirection: "row", gap: 10 },
  tombolOpsi: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: "center" },
  teksOpsi: { fontSize: 14, fontWeight: "500" },
  versiText: { textAlign: "center", fontSize: 12, marginTop: 20 },
});