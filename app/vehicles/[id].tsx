import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { VehicleItem } from '../../types/vehicle';
import { getVehicleById } from '../../services/vehicleService';
import { globalStyles } from '../../styles';

export default function VehicleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [vehicle, setVehicle] = useState<VehicleItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadDetail(id);
    }
  }, [id]);

  const loadDetail = async (vehicleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getVehicleById(vehicleId);
      setVehicle(data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat detail kendaraan dari External API.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={[globalStyles.title, { fontSize: 13, marginTop: 10 }]}>
          Mengambil spesifikasi unit kendaraan (ID: {id})...
        </Text>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <View style={globalStyles.loadingContainer}>
        <View style={globalStyles.errorContainer}>
          <Text style={[globalStyles.title, { color: '#B91C1C' }]}>Pemberitahuan</Text>
          <Text style={[globalStyles.errorText, { textAlign: 'center' }]}>
            {error || 'Unit kendaraan tidak ditemukan di server.'}
          </Text>
        </View>
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.primaryButtonText}>Kembali ke Katalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (

    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {}
        {vehicle.thumbnail ? (
          <Image
            source={{ uri: vehicle.thumbnail }}
            style={{ width: '100%', height: 210, borderRadius: 12, backgroundColor: '#E2E8F0', marginBottom: 16 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: 140,
              borderRadius: 12,
              backgroundColor: '#F1F5F9',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8' }}>FOTO UNIT TIDAK TERSEDIA</Text>
          </View>
        )}

        {}
        <View style={[globalStyles.card, { marginHorizontal: 0 }]}>
          <Text style={[globalStyles.title, { fontSize: 20 }]}>{vehicle.title}</Text>
          <Text style={[globalStyles.subtitle, { fontSize: 13, marginTop: 4 }]}>
            Brand: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{vehicle.brand || '-'}</Text> | SKU: {vehicle.sku}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, gap: 8 }}>
            <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE' }}>
              <Text style={{ color: '#1D4ED8', fontWeight: '800', fontSize: 12 }}>
                Status: {vehicle.availabilityStatus || 'Aktif'}
              </Text>
            </View>
            <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ color: '#475569', fontWeight: '700', fontSize: 12 }}>
                Stok Unit: {vehicle.stock}
              </Text>
            </View>
          </View>

          <Text style={[globalStyles.subtitle, { lineHeight: 18, color: '#334155' }]}>
            {vehicle.description}
          </Text>
        </View>

        {}
        {vehicle.dimensions && (
          <View style={[globalStyles.card, { marginHorizontal: 0 }]}>
            <Text style={[globalStyles.title, { fontSize: 14, marginBottom: 8 }]}>
              Dimensi Fisik Unit (Nested Interface):
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={globalStyles.statBox}>
                <Text style={globalStyles.statValue}>{vehicle.dimensions.width}</Text>
                <Text style={globalStyles.statLabel}>Lebar (cm)</Text>
              </View>
              <View style={globalStyles.statBox}>
                <Text style={globalStyles.statValue}>{vehicle.dimensions.height}</Text>
                <Text style={globalStyles.statLabel}>Tinggi (cm)</Text>
              </View>
              <View style={globalStyles.statBox}>
                <Text style={globalStyles.statValue}>{vehicle.dimensions.depth}</Text>
                <Text style={globalStyles.statLabel}>Panjang (cm)</Text>
              </View>
            </View>
          </View>
        )}

        {}
        <View style={[globalStyles.card, { marginHorizontal: 0, gap: 8 }]}>
          <Text style={{ fontSize: 12, color: '#64748B' }}>
            Status Ketersediaan:{' '}
            <Text style={{ fontWeight: '700', color: '#10B981' }}>{vehicle.availabilityStatus}</Text>
          </Text>
          <Text style={{ fontSize: 12, color: '#64748B' }}>
            Garansi Resmi:{' '}
            <Text style={{ fontWeight: '700', color: '#0F172A' }}>{vehicle.warrantyInformation || '-'}</Text>
          </Text>
          <Text style={{ fontSize: 12, color: '#64748B' }}>
            Ketentuan Distribusi:{' '}
            <Text style={{ fontWeight: '700', color: '#0F172A' }}>{vehicle.shippingInformation || '-'}</Text>
          </Text>
          {vehicle.meta?.barcode && (
            <Text style={{ fontSize: 12, color: '#64748B' }}>
              Barcode Unit: <Text style={{ fontFamily: 'monospace', fontWeight: '700' }}>{vehicle.meta.barcode}</Text>
            </Text>
          )}
        </View>

        {}
        <TouchableOpacity
          style={[globalStyles.secondaryButton, { marginTop: 8 }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.secondaryButtonText}>Kembali ke Katalog Kendaraan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
