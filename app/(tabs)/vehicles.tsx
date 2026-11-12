import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
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

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={[globalStyles.title, { fontSize: 14, marginTop: 12 }]}>
          Menghubungkan ke External API DummyJSON...
        </Text>
        <Text style={globalStyles.subtitle}>Menjalankan custom async function dan delay</Text>
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

  return (
    <SafeAreaView style={globalStyles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item: VehicleItem) => item.id.toString()}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            {}
            <TouchableOpacity
              style={[
                globalStyles.card,
                {
                  marginHorizontal: 0,
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  marginBottom: 14,
                },
              ]}
              onPress={() => router.push('/vehicles/promise-demo')}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View
                  style={{
                    backgroundColor: '#2563EB',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>RUBRIK 3</Text>
                </View>
                <Text style={{ color: '#38BDF8', fontWeight: '800', fontSize: 13 }}>
                  Demo Promise .then() / catch()
                </Text>
              </View>
              <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>
                Implementasi new Promise((resolve, reject) =&gt; ...) konsumsi via chaining
              </Text>
            </TouchableOpacity>

            <Text style={globalStyles.title}>Katalog Kendaraan Terintegrasi</Text>
            <Text style={globalStyles.subtitle}>
              Data LIVE dari endpoint External API DummyJSON Vehicles
            </Text>
          </View>
        }
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
                <Text style={{ fontSize: 11, color: '#D97706', fontWeight: '700', marginTop: 2 }}>
                  Skor Rating: {item.rating} / 5.0
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#2563EB' }}>
                  ${item.price.toLocaleString()}
                </Text>

                <TouchableOpacity
                  style={[globalStyles.primaryButton, { paddingVertical: 6, paddingHorizontal: 12 }]}
                  onPress={() => router.push({ pathname: '/vehicles/[id]', params: { id: item.id.toString() } })}
                >
                  <Text style={[globalStyles.primaryButtonText, { fontSize: 11 }]}>Detail &gt;</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
