import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

import { VehicleItem } from '../../types/vehicle';
import { getVehicles } from '../../services/vehicleService';
import { globalStyles } from '../../styles';

export default function VehiclesTabScreen() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: VehicleItem[] = await getVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data dari External API.');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      (item.brand && item.brand.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={[globalStyles.title, { fontSize: 14, marginTop: 12 }]}>
          Menghubungkan ke External API DummyJSON...
        </Text>
        <Text style={globalStyles.subtitle}>Mengambil data katalog kendaraan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.loadingContainer}>
        <View style={globalStyles.errorContainer}>
          <Text style={[globalStyles.title, { color: '#B91C1C', textAlign: 'center' }]}>
            Gagal Memuat Data
          </Text>
          <Text style={[globalStyles.errorText, { textAlign: 'center', marginTop: 4 }]}>
            {error}
          </Text>
        </View>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={loadData}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.primaryButtonText}>Muat Ulang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={{ padding: 16 }}>
      {/* Banner Akses Promise Demo */}
      <TouchableOpacity
        style={[
          globalStyles.card,
          {
            marginHorizontal: 0,
            backgroundColor: '#0F172A',
            borderColor: '#334155',
            marginBottom: 14,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}
        onPress={() => router.push('/vehicles/promise-demo')}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16 }}>⚡</Text>
          <Text style={{ color: '#38BDF8', fontWeight: '700', fontSize: 13 }}>
            Uji Alur Promise (.then / catch)
          </Text>
        </View>
        <Text style={{ color: '#94A3B8', fontSize: 12 }}>Buka &gt;</Text>
      </TouchableOpacity>

      <Text style={globalStyles.title}>
        Katalog Kendaraan Terintegrasi ({filteredVehicles.length})
      </Text>
      <Text style={globalStyles.subtitle}>
        Data LIVE dari endpoint External API DummyJSON Vehicles
      </Text>

      {/* Input Pencarian API Kendaraan */}
      <View style={{ marginTop: 12, position: 'relative', justifyContent: 'center' }}>
        <TextInput
          style={[globalStyles.input, { marginBottom: 0, paddingRight: searchQuery ? 40 : 12 }]}
          placeholder="Cari berdasarkan nama atau merk kendaraan..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 12,
              padding: 4,
            }}
          >
            <Text style={{ color: '#94A3B8', fontWeight: '800', fontSize: 14 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item: VehicleItem) => item.id.toString()}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }: { item: VehicleItem }) => (
          <View
            style={[globalStyles.card, { flexDirection: 'row', gap: 12 }]}
          >
            {item.thumbnail ? (
              <Image
                source={{ uri: item.thumbnail }}
                style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: '#E2E8F0' }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                  backgroundColor: '#F1F5F9',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8' }}>NO IMG</Text>
              </View>
            )}

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                <Text style={globalStyles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={globalStyles.subtitle}>Brand: {item.brand || 'Standar'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
                  <View
                    style={{
                      backgroundColor: '#EFF6FF',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: '#BFDBFE',
                    }}
                  >
                    <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#1D4ED8' }}>
                      Kendaraan Kampus
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#64748B' }}>
                    Stok: {item.stock} unit
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8 }}>
                <TouchableOpacity
                  style={[globalStyles.primaryButton, { paddingVertical: 6, paddingHorizontal: 14 }]}
                  onPress={() => router.push({ pathname: '/vehicles/[id]', params: { id: item.id.toString() } })}
                >
                  <Text style={[globalStyles.primaryButtonText, { fontSize: 11 }]}>Detail &gt;</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>Kendaraan Tidak Ditemukan</Text>
            <Text style={[globalStyles.subtitle, { textAlign: 'center', marginTop: 4 }]}>
              Tidak ada data yang cocok dengan "{searchQuery}".
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
