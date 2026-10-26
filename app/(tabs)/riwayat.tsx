// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import { View, Text, Alert, Platform, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { daftarKotaTersimpan, hapusCacheSpesifik } from "../../services/cacheRepository";
import { RingkasanKotaTersimpan } from "../../types/cache";
import { useTheme } from "../../context/ThemeContext";

export default function TabRiwayat() {
  const [daftarKota, setDaftarKota] = useState<RingkasanKotaTersimpan[]>([]);
  const { themeColors } = useTheme();

  const muatData = async () => {
    const data = await daftarKotaTersimpan();
    setDaftarKota(data);
  };

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [])
  );

  async function hapus(kunci: string) {
    await hapusCacheSpesifik(kunci);
    setDaftarKota((prev) => prev.filter((k) => k.kunci !== kunci));
  }

  function konfirmasiHapus(item: RingkasanKotaTersimpan) {
    if (Platform.OS === "web") {
      const yakin = window.confirm(`Apakah Anda yakin ingin menghapus cache data cuaca untuk ${item.nama}?`);
      if (yakin) hapus(item.kunci);
    } else {
      Alert.alert(
        "Hapus Cache Kota",
        `Apakah Anda yakin ingin menghapus cache data cuaca untuk ${item.nama}?`,
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: () => hapus(item.kunci) },
        ]
      );
    }
  }

  const bukaKota = (kota: RingkasanKotaTersimpan) => {
    router.push({
      pathname: "/",
      params: { lat: String(kota.latitude), lon: String(kota.longitude), nama: kota.nama },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.judul, { color: themeColors.text }]}>Riwayat & Cache Kota Tersimpan</Text>
      
      <Text style={[styles.subjudul, { color: themeColors.subtext }]}>
        Tersimpan {daftarKota.length} kota di perangkat (bisa dibuka offline)
      </Text>

      {daftarKota.length === 0 ? (
        <View style={styles.kosongContainer}>
          <Text style={[styles.teksKosong, { color: themeColors.subtext }]}>Belum ada riwayat kota tersimpan.</Text>
        </View>
      ) : (
        <FlatList
          data={daftarKota}
          keyExtractor={(item) => item.kunci}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => bukaKota(item)}>
                <Text style={[styles.namaKota, { color: themeColors.text }]}>{item.nama}</Text>
                <Text style={[styles.infoWaktu, { color: themeColors.subtext }]}>
                  Diperbarui: {new Date(item.disimpanPada).toLocaleString("id-ID")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => konfirmasiHapus(item)} style={styles.tombolHapus}>
                <Ionicons name="trash-outline" size={22} color={themeColors.danger} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  judul: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  subjudul: { fontSize: 13, fontStyle: "italic", marginBottom: 16 },
  kosongContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  teksKosong: { fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  namaKota: { fontSize: 16, fontWeight: "600" },
  infoWaktu: { fontSize: 11, marginTop: 4 },
  tombolHapus: { padding: 8 },
});