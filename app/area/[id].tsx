import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { INITIAL_PARKING_AREAS } from '../../data/parkingAreas';
import { formatRupiah } from '../../utils/helpers';

import { globalStyles } from '../../styles';

export default function AreaDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const area = INITIAL_PARKING_AREAS.find((item) => item.id === id);

  
  const handleKembali = () => {
    if (router.canGoBack()) {

      router.back();
    } else {
      router.replace('/');
    }
  };

  if (!area) {
    return (
      <View style={globalStyles.loadingContainer}>
        <Text style={[globalStyles.title, { color: '#EF4444' }]}>Area Parkir Tidak Ditemukan</Text>
        <TouchableOpacity
          style={[globalStyles.primaryButton, { marginTop: 14 }]}
          onPress={handleKembali}
        >
          <Text style={globalStyles.primaryButtonText}>Kembali ke Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sisaSlot = Math.max(0, area.kapasitasTotal - area.slotTerisi);
  const occupancy = Math.round((area.slotTerisi / area.kapasitasTotal) * 100);
  const statusColor =
    area.status === 'Penuh' ? '#EF4444' : area.status === 'Ramai' ? '#F59E0B' : '#10B981';

  return (

    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {}
        <View

          style={[globalStyles.card, { marginHorizontal: 0, borderLeftWidth: 6, borderLeftColor: statusColor }]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: area.tipeKendaraan === 'Mobil' ? '#DBEAFE' : '#EDE9FE',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 12,
                  color: area.tipeKendaraan === 'Mobil' ? '#1E40AF' : '#6B21A8',
                }}
              >
                KHUSUS {area.tipeKendaraan.toUpperCase()}
              </Text>
            </View>

            {}
            <View
              style={{
                backgroundColor: statusColor + '20',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: statusColor, fontWeight: '800', fontSize: 12 }}>
                Status: {area.status}
              </Text>
            </View>
          </View>

          <Text style={[globalStyles.title, { fontSize: 20, marginTop: 10 }]}>{area.namaArea}</Text>
          <Text style={[globalStyles.subtitle, { fontSize: 13, marginTop: 4 }]}>
            Lokasi: {area.lokasiGedung || 'Kampus Utama'} (Lantai {area.lantai || 1})
          </Text>

          {}
          <View style={{ marginVertical: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: '#64748B' }}>Persentase Terisi:</Text>
              {}
              <Text style={{ fontSize: 12, fontWeight: '800', color: statusColor }}>
                {occupancy}% ({area.slotTerisi}/{area.kapasitasTotal} Slot)
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
              <View

                style={{
                  height: '100%',
                  width: `${Math.min(occupancy, 100)}%`,
                  backgroundColor: statusColor,
                }}
              />
            </View>
          </View>

          {}
          <View style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#64748B' }}>Tarif Parkir:</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#0F172A' }}>
                {formatRupiah(area.tarifPerJam || 2000)} / jam
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#64748B' }}>Sisa Slot Kosong:</Text>
              <Text style={{ fontSize: 13, fontWeight: '800', color: statusColor }}>
                {sisaSlot} slot
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#64748B' }}>Jenis Kendaraan:</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#0F172A' }}>
                Khusus {area.tipeKendaraan}
              </Text>
            </View>
          </View>
        </View>

        {}
        <View style={{ gap: 10, marginTop: 10 }}>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => router.push('/modal/ticket')}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.primaryButtonText}>Terbitkan Tiket Masuk (Modal)</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={handleKembali}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.secondaryButtonText}>Kembali ke Daftar Area</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
