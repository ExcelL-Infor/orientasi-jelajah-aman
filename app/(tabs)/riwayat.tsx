// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import { View, Text, Button, Alert, Platform, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { daftarKotaTersimpan, hapusCacheSpesifik } from "../../services/cacheRepository";
import { RingkasanKotaTersimpan } from "../../types/cache";

export default function TabRiwayat() {
  const [daftarKota, setDaftarKota] = useState<RingkasanKotaTersimpan[]>([]);

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

  // Fungsi konfirmasi hapus dengan dukungan multi-platform (Web & Mobile)
  function konfirmasiHapus(item: RingkasanKotaTersimpan) {
    if (Platform.OS === "web") {
      const yakin = window.confirm(`Apakah Anda yakin ingin menghapus cache data cuaca untuk ${item.nama}?`);
      if (yakin) {
        hapus(item.kunci);
      }
    } else {
      Alert.alert(
        "Hapus Cache Kota",
        `Apakah Anda yakin ingin menghapus cache data cuaca untuk ${item.nama}?`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            style: "destructive",
            onPress: () => hapus(item.kunci),
          },
        ]
      );
    }
  }

  // Fungsi saat item kota diklik untuk membukanya kembali di Beranda
  const bukaKota = (kota: RingkasanKotaTersimpan) => {
    router.push({
      pathname: "/",
      params: {
        lat: String(kota.latitude),
        lon: String(kota.longitude),
        nama: kota.nama,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.judul}>Riwayat & Cache Kota Tersimpan</Text>
      
      <Text style={styles.subjudul}>
        Tersimpan {daftarKota.length} kota di perangkat (bisa dibuka offline)
      </Text>

      {daftarKota.length === 0 ? (
        <View style={styles.kosongContainer}>
          <Text style={styles.teksKosong}>Belum ada riwayat kota tersimpan.</Text>
        </View>
      ) : (
        <FlatList
          data={daftarKota}
          keyExtractor={(item) => item.kunci}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => bukaKota(item)}>
                <Text style={styles.namaKota}>{item.nama}</Text>
                <Text style={styles.infoWaktu}>
                  Diperbarui: {new Date(item.disimpanPada).toLocaleString("id-ID")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => konfirmasiHapus(item)}
                style={styles.tombolHapus}
              >
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  judul: { fontSize: 20, fontWeight: "bold", marginBottom: 4, color: "#0f172a" },
  subjudul: { fontSize: 13, fontStyle: "italic", color: "#64748b", marginBottom: 16 },
  kosongContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  teksKosong: { color: "#64748b", fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  namaKota: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  infoWaktu: { fontSize: 11, color: "#64748b", marginTop: 4 },
  tombolHapus: { padding: 8 },
});