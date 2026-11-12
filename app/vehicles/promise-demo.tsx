import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { VehicleItem } from '../../types/vehicle';

import { fetchVehiclesWithPromise } from '../../services/vehicleService';
import { globalStyles } from '../../styles';

export default function PromiseDemoScreen() {
  const router = useRouter();

  const [dataList, setDataList] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logStatus, setLogStatus] = useState<string>('Memulai pemanggilan Promise...');

  const executePromiseFetch = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setLogStatus('Menjalankan fetchVehiclesWithPromise()...');

    
    fetchVehiclesWithPromise()
      .then((items: VehicleItem[]) => {

        setDataList(items);
        setLogStatus(`RESOLVE Berhasil! Diterima ${items.length} item data dari API.`);
        setIsLoading(false);
      })
      .catch((error: any) => {
        

        setErrorMessage(error?.toString() || 'Terjadi kegagalan Promise.');
        setLogStatus('REJECT Terjadi! Kesalahan ditangkap oleh blok .catch().');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    executePromiseFetch();
  }, []);

  return (

    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {}
        <View style={[globalStyles.card, { marginHorizontal: 0, backgroundColor: '#0F172A', borderColor: '#334155' }]}>
          <Text style={[globalStyles.title, { color: '#38BDF8', fontSize: 15 }]}>
            Demonstrasi Promise: resolve, reject, &amp; .then()
          </Text>
          <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, lineHeight: 18 }}>
            Halaman ini khusus mendemonstrasikan konsumsi Promise menggunakan gaya rantai{' '}
            <Text style={{ color: '#FCD34D', fontWeight: '700' }}>.then()</Text> dan{' '}
            <Text style={{ color: '#F87171', fontWeight: '700' }}>.catch()</Text> secara eksplisit
            (berbeda dengan halaman sebelumnya yang memakai async/await).
          </Text>
          <View style={{ marginTop: 10, padding: 8, backgroundColor: '#1E293B', borderRadius: 8 }}>
            <Text style={{ fontSize: 11, color: '#A7F3D0', fontFamily: 'monospace' }}>
              Status: {logStatus}
            </Text>
          </View>
        </View>

        {}
        {isLoading && (
          <View style={{ paddingVertical: 30, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[globalStyles.subtitle, { marginTop: 10 }]}>
              Menunggu penyelesaian Promise (Pending state)...
            </Text>
          </View>
        )}

        {}
        {errorMessage && (
          <View style={globalStyles.errorContainer}>
            <Text style={[globalStyles.title, { color: '#B91C1C' }]}>Reject Error</Text>
            <Text style={globalStyles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {}
        {!isLoading && !errorMessage && (
          <View style={{ marginVertical: 8 }}>
            <Text style={[globalStyles.title, { fontSize: 14, marginBottom: 8 }]}>
              Data Berhasil Diselesaikan via .then() ({dataList.length} Kendaraan):
            </Text>

            {dataList.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  globalStyles.card,
                  { marginHorizontal: 0, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
                ]}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontWeight: '800', color: '#2563EB' }}>{idx + 1}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[globalStyles.title, { fontSize: 13 }]}>{item.title}</Text>
                  <Text style={globalStyles.subtitle}>
                    Brand: {item.brand || '-'} | Harga: ${item.price} | Stok: {item.stock}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {}
        <View style={{ gap: 8, marginTop: 14 }}>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={executePromiseFetch}
            disabled={isLoading}
          >
            <Text style={globalStyles.primaryButtonText}>
              Eksekusi Ulang Promise (.then() / .catch())
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={globalStyles.secondaryButtonText}>Kembali ke Halaman Sebelumnya</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
