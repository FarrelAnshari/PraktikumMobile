import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { INITIAL_PARKING_AREAS } from '../../data/parkingAreas';
import { ParkingArea } from '../../types/parking';
import { formatTanggalWaktu } from '../../utils/helpers';
import { globalStyles } from '../../styles';

interface Ticket {
  idTiket: string;
  platNomor: string;
  jenisKendaraan: 'Motor' | 'Mobil';
  waktuMasuk: string;
  areaId: string;
  namaArea: string;
  status: 'Aktif' | 'Selesai';
}

const INITIAL_TICKETS: Ticket[] = [
  {
    idTiket: 'TKT-884102',
    platNomor: 'B 1234 SKP',
    jenisKendaraan: 'Mobil',
    waktuMasuk: '12 Nov 2026, 07:45',
    areaId: 'area-1',
    namaArea: 'Parkir Utama Rektorat',
    status: 'Aktif',
  },
  {
    idTiket: 'TKT-884103',
    platNomor: 'D 5678 FT',
    jenisKendaraan: 'Motor',
    waktuMasuk: '12 Nov 2026, 08:15',
    areaId: 'area-3',
    namaArea: 'Parkir Fakultas Teknik',
    status: 'Aktif',
  },
];

export default function CheckInTabScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'baru' | 'riwayat'>('baru');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'Motor' | 'Mobil'>('Motor');
  const [selectedAreaId, setSelectedAreaId] = useState('area-2');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeTicketModal, setActiveTicketModal] = useState<Ticket | null>(null);

  const availableAreas = INITIAL_PARKING_AREAS.filter(
    (a) => a.tipeKendaraan === vehicleType && a.slotTerisi < a.kapasitasTotal
  );

  const handleSimulateQRScan = () => {
    setIsCameraActive(true);
    setTimeout(() => {
      const samplePlates = ['B 4567 SKP', 'D 1984 UGM', 'L 3321 POL', 'AB 6789 UI', 'DK 8899 ITB'];
      const randomPlate = samplePlates[Math.floor(Math.random() * samplePlates.length)];
      setPlateNumber(randomPlate);
      setIsCameraActive(false);
      Alert.alert('Scanner Berhasil', `Nomor plat teridentifikasi: ${randomPlate}`);
    }, 1200);
  };

  const handleSubmitCheckIn = () => {
    if (!plateNumber.trim()) {
      Alert.alert('Perhatian', 'Harap masukkan nomor plat atau gunakan scanner otomatis.');
      return;
    }

    const targetArea = INITIAL_PARKING_AREAS.find((a) => a.id === selectedAreaId);
    if (!targetArea) {
      Alert.alert('Perhatian', 'Pilih area parkir yang tersedia.');
      return;
    }

    const newTicket: Ticket = {
      idTiket: `TKT-${Date.now().toString().slice(-6)}`,
      platNomor: plateNumber.toUpperCase().trim(),
      jenisKendaraan: vehicleType,
      waktuMasuk: formatTanggalWaktu(new Date()),
      areaId: targetArea.id,
      namaArea: targetArea.namaArea,
      status: 'Aktif',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicketModal(newTicket);
    setPlateNumber('');
  };

  const handleCheckoutTicket = (ticket: Ticket) => {
    const doCheckout = () => {
      setTickets((prev) =>
        prev.map((t) => (t.idTiket === ticket.idTiket ? { ...t, status: 'Selesai' } : t))
      );
      Alert.alert('Checkout Berhasil', `Kendaraan ${ticket.platNomor} telah keluar dari sistem parkir.`);
    };

    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined'
          ? window.confirm(
              `Kendaraan ${ticket.platNomor} akan keluar dari ${ticket.namaArea}. Slot akan dikosongkan. Lanjutkan?`
            )
          : true;
      if (confirmed) doCheckout();
      return;
    }

    Alert.alert(
      'Konfirmasi Checkout',
      `Kendaraan ${ticket.platNomor} akan keluar dari ${ticket.namaArea}. Slot akan dikosongkan. Lanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar (Selesai)', style: 'destructive', onPress: doCheckout },
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {}
      <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: activeTab === 'baru' ? '#EFF6FF' : '#FFFFFF',
            borderWidth: 1,
            borderColor: activeTab === 'baru' ? '#BFDBFE' : 'transparent',
          }}
          onPress={() => setActiveTab('baru')}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === 'baru' ? '#2563EB' : '#64748B' }}>
            Check-In Baru
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: activeTab === 'riwayat' ? '#EFF6FF' : '#FFFFFF',
            borderWidth: 1,
            borderColor: activeTab === 'riwayat' ? '#BFDBFE' : 'transparent',
          }}
          onPress={() => setActiveTab('riwayat')}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === 'riwayat' ? '#2563EB' : '#64748B' }}>
            Riwayat Tiket ({tickets.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {activeTab === 'baru' ? (
          <View>
            {}
            <View
              style={{
                backgroundColor: '#0F172A',
                borderRadius: 16,
                padding: 20,
                alignItems: 'center',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#334155',
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: 170,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: isCameraActive ? '#10B981' : '#334155',
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#1E293B',
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 6,
                    backgroundColor: '#0F172A',
                    borderWidth: 1,
                    borderColor: '#334155',
                  }}
                >
                  <Text style={{ color: isCameraActive ? '#10B981' : '#94A3B8', fontSize: 12, fontWeight: '700' }}>
                    {isCameraActive ? 'MEMINDAI SENSOR GERBANG...' : 'SENSOR OPTIK OTOMATIS'}
                  </Text>
                </View>
                <Text style={{ color: '#64748B', fontSize: 11, marginTop: 8 }}>
                  Arahkan plat kendaraan atau kode akses
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#2563EB',
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                  marginTop: 14,
                  width: '100%',
                  alignItems: 'center',
                }}
                onPress={handleSimulateQRScan}
                disabled={isCameraActive}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                  {isCameraActive ? 'Sedang Memindai...' : 'Pindai Plat Otomatis'}
                </Text>
              </TouchableOpacity>
            </View>

            {}
            <View style={[globalStyles.card, { marginHorizontal: 0 }]}>
              <Text style={globalStyles.title}>Registrasi Masuk Kendaraan</Text>
              <Text style={globalStyles.subtitle}>Pilih kategori dan tentukan nomor identitas kendaraan</Text>

              <Text style={[globalStyles.subtitle, { fontWeight: '700', marginTop: 12, marginBottom: 4 }]}>
                Nomor Plat Kendaraan:
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Contoh: B 1234 SKP"
                value={plateNumber}
                onChangeText={(v) => setPlateNumber(v.toUpperCase())}
                autoCapitalize="characters"
              />

              <Text style={[globalStyles.subtitle, { fontWeight: '700', marginTop: 12, marginBottom: 4 }]}>
                Jenis Kendaraan:
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                {(['Motor', 'Mobil'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor: vehicleType === t ? '#2563EB' : '#F1F5F9',
                      borderWidth: 1,
                      borderColor: vehicleType === t ? '#1D4ED8' : '#E2E8F0',
                    }}
                    onPress={() => setVehicleType(t)}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: vehicleType === t ? '#FFFFFF' : '#475569' }}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[globalStyles.subtitle, { fontWeight: '700', marginTop: 8, marginBottom: 6 }]}>
                Pilih Area Parkir Tersedia:
              </Text>
              {availableAreas.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const sisa = area.kapasitasTotal - area.slotTerisi;
                return (
                  <TouchableOpacity
                    key={area.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1.5,
                      borderColor: isSelected ? '#2563EB' : '#E2E8F0',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      marginBottom: 8,
                    }}
                    onPress={() => setSelectedAreaId(area.id)}
                  >
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        borderWidth: 2,
                        borderColor: isSelected ? '#2563EB' : '#94A3B8',
                        backgroundColor: isSelected ? '#2563EB' : 'transparent',
                        marginRight: 10,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>
                        {area.namaArea}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748B' }}>
                        Sisa: {sisa} slot dari total {area.kapasitasTotal}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[globalStyles.primaryButton, { backgroundColor: '#10B981', marginTop: 12 }]}
                onPress={handleSubmitCheckIn}
              >
                <Text style={globalStyles.primaryButtonText}>Terbitkan Tiket Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          
          <View>
            <Text style={[globalStyles.title, { marginBottom: 10 }]}>Daftar Tiket Kendaraan</Text>
            {tickets.map((t) => (
              <View
                key={t.idTiket}
                style={[
                  globalStyles.card,
                  { marginHorizontal: 0, opacity: t.status === 'Selesai' ? 0.6 : 1 },
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[globalStyles.title, { fontSize: 14 }]}>{t.idTiket}</Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4,
                      backgroundColor: t.status === 'Aktif' ? '#DCFCE7' : '#F1F5F9',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '800',
                        color: t.status === 'Aktif' ? '#166534' : '#64748B',
                      }}
                    >
                      {t.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={globalStyles.subtitle}>{t.namaArea}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#2563EB' }}>
                    {t.platNomor}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B' }}>{t.waktuMasuk}</Text>
                </View>

                {t.status === 'Aktif' && (
                  <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                    <TouchableOpacity
                      style={globalStyles.secondaryButton}
                      onPress={() => setActiveTicketModal(t)}
                    >
                      <Text style={globalStyles.secondaryButtonText}>Lihat Kode Tiket</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[globalStyles.secondaryButton, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}
                      onPress={() => handleCheckoutTicket(t)}
                    >
                      <Text style={[globalStyles.secondaryButtonText, { color: '#EF4444' }]}>
                        Checkout Selesai
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {}
      <Modal
        visible={!!activeTicketModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveTicketModal(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.7)', justifyContent: 'center', padding: 24 }}>
          <View style={[globalStyles.card, { marginHorizontal: 0, padding: 20, alignItems: 'center' }]}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                backgroundColor: '#2563EB',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#FFFFFF' }}>TKT</Text>
            </View>
            <Text style={[globalStyles.title, { fontSize: 18, marginTop: 4 }]}>E-TIKET DIGITAL PARKIN</Text>
            <Text style={globalStyles.subtitle}>{activeTicketModal?.idTiket}</Text>

            <View style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 12, marginVertical: 14, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#2563EB', marginTop: 4 }}>
                {activeTicketModal?.platNomor}
              </Text>
              <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                {activeTicketModal?.namaArea}
              </Text>
              <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                Masuk: {activeTicketModal?.waktuMasuk}
              </Text>
            </View>

            <TouchableOpacity
              style={[globalStyles.primaryButton, { width: '100%' }]}
              onPress={() => setActiveTicketModal(null)}
            >
              <Text style={globalStyles.primaryButtonText}>Tutup Tiket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
