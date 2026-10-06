//app/(tabs)/index.tsx
import { useState, useEffect, useRef,useCallback } from "react";
import { View, Text, ActivityIndicator, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { ambilCuaca } from "../../services/weatherService";
import { ambilKualitasUdara } from "../../services/airQualityService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../types/geocoding";
import { DataCuacaLengkap, DataKualitasUdara } from "../../types/weather";
import { mintaIzinLokasi, ambilKoordinatSaatIni } from "../../services/locationService";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { ambilSemuaFavorit } from "../../services/favoritStorage";

export default function HalamanUtama() {
    const [teksCari, setTeksCari] = useState("");
    const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
    const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
    const [cuaca, setCuaca] = useState<DataCuacaLengkap | null>(null);
    const [kualitasUdara, setKualitasUdara] = useState<DataKualitasUdara | null>(null);
    const [sedangMemuat, setSedangMemuat] = useState(false);
    const [pesanError, setPesanError] = useState<string | null>(null);
    const teksTertunda = useDebounce(teksCari, 500);
    const requestIdRef = useRef(0);
    const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

    // Latihan Mandiri 3: State untuk mengecek apakah kota sudah jadi favorit
  const [isFavorit, setIsFavorit] = useState(false);

    useFocusEffect(
        useCallback(() => {
        if (kotaTerpilih) {
            ambilSemuaFavorit().then((daftar) => {
            // Mengecek apakah kotaTerpilih.id ada di dalam daftar penyimpanan
            const sudahAda = daftar.some((k) => k.id === kotaTerpilih.id);
            setIsFavorit(sudahAda);
            });
        }
        }, [kotaTerpilih])
    );
    useEffect(() => {
        if (teksTertunda.trim().length === 0) {
            setHasilPencarian([]);
            return;
        }
        cariKota(teksTertunda).then(setHasilPencarian).catch(() => setHasilPencarian([]));
    }, [teksTertunda]);

    async function pilihKota(kota: HasilGeocoding) {
        setKotaTerpilih(kota);
        const idSaatIni = ++requestIdRef.current;
        setSedangMemuat(true);
        setPesanError(null);
        try {
            const [dataCuaca, dataAQI] = await Promise.all([
                ambilCuaca(kota.latitude, kota.longitude),
                ambilKualitasUdara(kota.latitude, kota.longitude),
            ]);
            if (idSaatIni !== requestIdRef.current) return;
            setCuaca(dataCuaca);
            setKualitasUdara(dataAQI);
        } catch (err) {
            if (idSaatIni !== requestIdRef.current) return;
            setPesanError("Gagal memuat data cuaca. Periksa koneksi internet Anda.");
        } finally {
            if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
        }
    }
    async function gunakanLokasiSaatIni() {
        const status = await mintaIzinLokasi();
  
        if (status === "denied") {
        setPesanLokasi("Izin lokasi ditolak. Silakan cari kota secara manual di atas.");
        return;
        }
  
        if (status === "unavailable") {
        setPesanLokasi("Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.");
        return;
        }
  
        setPesanLokasi(null);
        const koordinat = await ambilKoordinatSaatIni();
  
        pilihKota({
        id: -1,
        name: "Lokasi Saat Ini",
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        country: "",
  });
}
        
    

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
            <SearchBox onCari={setTeksCari} />
            <Button title="Gunakan Lokasi Saat Ini" onPress={gunakanLokasiSaatIni} />{pesanLokasi && <Text>{pesanLokasi}</Text>}
            {hasilPencarian.map((kota) => (
                <TouchableOpacity key={kota.id} onPress={() => pilihKota(kota)}>
                    <Text>{kota.name}</Text>
                </TouchableOpacity>
            ))}
            {sedangMemuat && <ActivityIndicator />}
            {pesanError && (
                <View>
                    <Text>{pesanError}</Text>
                    <Button
                        title="Coba Lagi"
                        onPress={() => kotaTerpilih && pilihKota(kotaTerpilih)}
                    />
                </View>
            )}
            
            {cuaca && kualitasUdara && kotaTerpilih && !sedangMemuat && (
                <View>
                    <WeatherCard
                        kota={kotaTerpilih.name}
                        suhu={cuaca.saatIni.suhu}
                        tingkatAQI={konversiTingkatAQI(kualitasUdara.indeksAQI)}
                        indeksAQI={kualitasUdara.indeksAQI}
                    />
                    {/* 1. Latihan Mandiri: Menambahkan Suhu Maksimal & Minimal */}
                    <Text style={{ textAlign: "center", marginTop: 8, fontSize: 14, fontWeight: "500" }}>
                        Suhu Hari Ini: Min {cuaca.harian.suhuMinimal[0]}°C | Maks {cuaca.harian.suhuMaksimal[0]}°C
                    </Text>
                    {/* TOMBOL FAVORIT DITAMBAHKAN DI SINI */}
                    {/* Latihan Mandiri 3: Nonaktifkan (disable) tombol jika sudah favorit */}
                    <Button
                        title={isFavorit ? "Sudah jadi Favorit" : "Tambahkan ke Favorit"}
                        disabled={isFavorit}
                        onPress={() =>
                            router.push({
                            pathname: "/tambah-favorit",
                            params: {
                                id: String(kotaTerpilih.id),
                                nama: kotaTerpilih.name,
                                lat: String(kotaTerpilih.latitude),
                                lon: String(kotaTerpilih.longitude),
                                },
                            })
                        }
                    />
                </View>
            )}

            {cuaca && (
                <Text style={{ fontSize: 12, color: "#888", textAlign: "center" }}>
                    Kondisi: {labelKodeCuaca(cuaca.saatIni.kodeCuaca)} | Angin {cuaca.saatIni.kecepatanAngin} km/j
                </Text>
            )}

            {/* 2. Latihan Mandiri: Menambahkan Data PM2.5 dan PM10 di atas Atribusi */}
            {kualitasUdara && (
                <View style={{ marginTop: "auto" }}>
                    <Text style={{ fontSize: 11, color: "#888", textAlign: "center", marginBottom: 4 }}>
                        Detail Polusi Udara: PM2.5 ({kualitasUdara.pm25}) | PM10 ({kualitasUdara.pm10})
                    </Text>
                    <AtribusiCuaca />
                </View>
            )}
            
            {/* Tampilkan atribusi jika belum ada pencarian agar tidak hilang */}
            {!kualitasUdara && (
                <View style={{ marginTop: "auto" }}>
                    <AtribusiCuaca />
                </View>
            )}
        </SafeAreaView>
    );
}