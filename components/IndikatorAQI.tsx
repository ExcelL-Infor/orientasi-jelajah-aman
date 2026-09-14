import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
  const warnaTeks = tingkat === "BAIK" ? "green" : tingkat === "SEDANG" ? "darkorange" : "red";

  return (
    <View style={{ padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, marginTop: 10 }}>
      <Text style={{ fontWeight: "bold" }}>Laporan: {kota}</Text>
      <Text>Indeks AQI: {indeksAQI}</Text>
      <Text style={{ color: warnaTeks, fontWeight: "bold" }}>Status: {tingkat}</Text>
      {diperbaruiPada && <Text style={{ fontSize: 12, color: "gray" }}>Update: {diperbaruiPada}</Text>}
    </View>
  );
}