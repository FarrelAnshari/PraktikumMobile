import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { globalStyles } from '../../styles';

export default function TicketModal() {
  const router = useRouter();

  return (
    <View style={[globalStyles.container, { padding: 20, justifyContent: 'center', backgroundColor: '#0F172A' }]}>
      {}
      <View style={[globalStyles.card, { marginHorizontal: 0, padding: 24, alignItems: 'center' }]}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#2563EB',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFFFFF' }}>TKT</Text>
        </View>

        <Text style={[globalStyles.title, { fontSize: 20, letterSpacing: 1.5 }]}>PARKIN E-TICKET</Text>
        <Text style={globalStyles.subtitle}>Tiket Digital Akses Gerbang Kampus</Text>

        {}
        <View
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: 16,
            borderWidth: 2,
            borderColor: '#E2E8F0',
            padding: 24,
            marginVertical: 18,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderWidth: 2,
              borderColor: '#0F172A',
              borderStyle: 'dashed',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B' }}>KODE AKSES</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#2563EB', marginTop: 12 }}>
            TKT-202611-884102
          </Text>
        </View>

        {}
        <View style={{ width: '100%', gap: 8, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: '#64748B' }}>Plat Nomor:</Text>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F172A' }}>B 1234 SKP</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: '#64748B' }}>Status Tiket:</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981' }}>AKTIF</Text>
          </View>
        </View>

        {}
        <TouchableOpacity
          style={[globalStyles.primaryButton, { width: '100%' }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.primaryButtonText}>Tutup Tiket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
