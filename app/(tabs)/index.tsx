import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ParkingArea } from '../../types/parking';

import { INITIAL_PARKING_AREAS } from '../../data/parkingAreas';

import {
  calculateParkingStatistics,
  formatRupiah,
  formatTanggalWaktu,
  getTopAvailableAreas,
} from '../../utils/helpers';

import { globalStyles } from '../../styles';

export default function HomeScreen() {
  const router = useRouter();

  const [query, setQuery] = useState<string>('');
  const [kategori, setKategori] = useState<string>('Semua');
  const [daftarHasil, setDaftarHasil] = useState<ParkingArea[]>(INITIAL_PARKING_AREAS);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const hasil = INITIAL_PARKING_AREAS.filter((item: ParkingArea) => {
      const matchSearch = item.namaArea.toLowerCase().includes(query.toLowerCase());
      const matchKategori = kategori === 'Semua' ? true : item.tipeKendaraan === kategori;
      return matchSearch && matchKategori;
    });
    setDaftarHasil(hasil);
  }, [query, kategori]);

  useEffect(() => {
    console.log('Mount Log: Komponen HomeScreen PARKIN berhasil dimuat pertama kali.');
  }, []);

  const stats = calculateParkingStatistics(INITIAL_PARKING_AREAS);

  const topAvailable = getTopAvailableAreas(INITIAL_PARKING_AREAS, 3);

  const handleToggleFavorite = (areaId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  const getStatusColor = (status: string) => {
    if (status === 'Penuh') return '#EF4444';
    if (status === 'Ramai') return '#F59E0B';
    return '#10B981';
  };

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
      {}
      <View

        style={[globalStyles.card, { marginHorizontal: 0, backgroundColor: '#0F172A', borderColor: '#334155' }]}
      >
        <Text style={[globalStyles.title, { color: '#F8FAFC', marginBottom: 2 }]}>
          Statistik Parkir Kampus
        </Text>
        <Text style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>
          Data diproses via custom function &amp; loop ({formatTanggalWaktu(new Date())})
        </Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={[globalStyles.statBox, { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
            <Text style={[globalStyles.statValue, { color: '#F8FAFC' }]}>{stats.totalKapasitas}</Text>
            <Text style={[globalStyles.statLabel, { color: '#94A3B8' }]}>Kapasitas</Text>
          </View>
          <View style={[globalStyles.statBox, { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
            <Text style={[globalStyles.statValue, { color: '#EF4444' }]}>{stats.totalTerisi}</Text>
            <Text style={[globalStyles.statLabel, { color: '#94A3B8' }]}>Terisi</Text>
          </View>
          <View style={[globalStyles.statBox, { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
            <Text style={[globalStyles.statValue, { color: '#10B981' }]}>{stats.totalTersedia}</Text>
            <Text style={[globalStyles.statLabel, { color: '#94A3B8' }]}>Tersedia</Text>
          </View>
        </View>

        <View style={{ marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#334155' }}>
          <Text style={{ fontSize: 11, color: '#38BDF8' }}>
            Rata-rata Occupancy: {stats.rataRataOccupancy}% {'\u2022'} Area Terpadat: {stats.areaTerpadat}
          </Text>
        </View>
      </View>

      {}
      <View style={{ marginBottom: 14 }}>
        <Text style={[globalStyles.title, { fontSize: 13, color: '#475569', marginBottom: 6 }]}>
          Top Rekomendasi Slot Tersedia (Custom Loop):
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
          {topAvailable.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              onPress={() => router.push({ pathname: '/area/[id]', params: { id: rec.id } })}
              style={{
                backgroundColor: '#EFF6FF',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                marginRight: 8,
                borderWidth: 1,
                borderColor: '#BFDBFE',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#1D4ED8' }}>{rec.namaArea}</Text>
              <Text style={{ fontSize: 10.5, color: '#2563EB' }}>
                Sisa {rec.kapasitasTotal - rec.slotTerisi} slot {'\u2022'} {formatRupiah(rec.tarifPerJam || 2000)}/jam
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {}
      <View style={{ marginBottom: 10 }}>
        <TextInput

          style={globalStyles.input}
          placeholder="Cari nama area parkir (real-time)..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
        {['Semua', 'Motor', 'Mobil'].map((cat) => {
          const isSelected = kategori === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setKategori(cat)}

              style={{
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: isSelected ? '#2563EB' : '#E2E8F0',
              }}
            >
              <Text

                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: isSelected ? '#FFFFFF' : '#475569',
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[globalStyles.title, { fontSize: 14, marginBottom: 4 }]}>
        Daftar Area Parkir Kampus ({daftarHasil.length})
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: ParkingArea }) => {
    const sisaSlot = Math.max(0, item.kapasitasTotal - item.slotTerisi);
    const occupancy = Math.round((item.slotTerisi / item.kapasitasTotal) * 100);
    const statusColor = getStatusColor(item.status);
    const isFav = favorites[item.id] || false;

    return (
      <View

        style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: statusColor }]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.title}>{item.namaArea}</Text>
            <Text style={globalStyles.subtitle}>
              {}
              <Text

                style={{
                  fontWeight: '700',
                  color: item.tipeKendaraan === 'Mobil' ? '#2563EB' : '#7C3AED',
                }}
              >
                [{item.tipeKendaraan}]
              </Text>
              {' '}{item.lokasiGedung || 'Kampus Utama'}
            </Text>
          </View>

          {}
          <TouchableOpacity
            onPress={() => handleToggleFavorite(item.id)}

            style={{
              padding: 6,
              borderRadius: 8,
              backgroundColor: isFav ? '#FEF3C7' : '#F1F5F9',
              borderWidth: 1,
              borderColor: isFav ? '#FCD34D' : '#E2E8F0',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '800',
                color: isFav ? '#D97706' : '#94A3B8',
              }}
            >
              {isFav ? 'SIMPAN' : 'SIMPAN'}
            </Text>
            <View
              style={{
                width: 16,
                height: 2,
                backgroundColor: isFav ? '#D97706' : '#CBD5E1',
                borderRadius: 1,
                marginTop: 2,
              }}
            />
          </TouchableOpacity>
        </View>

        {}
        <View style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginVertical: 10, overflow: 'hidden' }}>
          <View

            style={{
              height: '100%',
              width: `${Math.min(occupancy, 100)}%`,
              backgroundColor: statusColor,
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 12, color: '#64748B' }}>
              Tersedia: <Text style={{ fontWeight: '800', color: statusColor }}>{sisaSlot}</Text> / {item.kapasitasTotal}
            </Text>
            <Text style={{ fontSize: 11, color: '#059669', fontWeight: '600' }}>
              Tarif: {formatRupiah(item.tarifPerJam || 2000)}/jam
            </Text>
          </View>

          {}
          <TouchableOpacity

            style={[globalStyles.primaryButton, { paddingVertical: 8, paddingHorizontal: 12 }]}
            onPress={() => {

              router.push({
                pathname: '/area/[id]',
                params: { id: item.id },
              });
            }}
            activeOpacity={0.8}
          >
            <Text style={[globalStyles.primaryButtonText, { fontSize: 12 }]}>Detail Area &gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (

    <SafeAreaView style={globalStyles.container}>
      <FlatList
        data={daftarHasil}
        keyExtractor={(item: ParkingArea) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
