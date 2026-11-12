import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CheckInScreen from './screens/CheckInScreen';
import PetugasScreen from './screens/PetugasScreen';

// Data Awal Area Parkir Kampus
const INITIAL_AREAS = [
  {
    id: 'area-1',
    namaArea: 'Parkir Utama Rektorat',
    kapasitasTotal: 60,
    slotTerisi: 32,
    tipeKendaraan: 'Mobil',
  },
  {
    id: 'area-2',
    namaArea: 'Parkir Gedung Kuliah Bersama (GKB)',
    kapasitasTotal: 150,
    slotTerisi: 138, // 92% -> Penuh (Merah)
    tipeKendaraan: 'Motor',
  },
  {
    id: 'area-3',
    namaArea: 'Parkir Fakultas Teknik',
    kapasitasTotal: 200,
    slotTerisi: 162, // 81% -> Ramai (Kuning)
    tipeKendaraan: 'Motor',
  },
  {
    id: 'area-4',
    namaArea: 'Parkir Perpustakaan Pusat',
    kapasitasTotal: 40,
    slotTerisi: 18, // 45% -> Tersedia (Hijau)
    tipeKendaraan: 'Mobil',
  },
  {
    id: 'area-5',
    namaArea: 'Parkir Gedung Sains & FMIPA',
    kapasitasTotal: 120,
    slotTerisi: 90, // 75% -> Ramai (Kuning)
    tipeKendaraan: 'Motor',
  },
  {
    id: 'area-6',
    namaArea: 'Parkir Pascasarjana & Lab Riset',
    kapasitasTotal: 50,
    slotTerisi: 49, // 98% -> Penuh (Merah)
    tipeKendaraan: 'Mobil',
  },
];

// Data Awal Tiket
const INITIAL_TICKETS = [
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
  {
    idTiket: 'TKT-884099',
    platNomor: 'L 9012 UI',
    jenisKendaraan: 'Motor',
    waktuMasuk: '12 Nov 2026, 06:30',
    areaId: 'area-2',
    namaArea: 'Parkir Gedung Kuliah Bersama (GKB)',
    status: 'Selesai',
  },
];

export default function App() {
  const [user, setUser] = useState(null); // null = belum login
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'checkin' | 'petugas'
  const [areas, setAreas] = useState(INITIAL_AREAS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAreaForCheckIn, setSelectedAreaForCheckIn] = useState(null);

  // Riwayat Log HTTP API untuk praktikum
  const [apiLogs, setApiLogs] = useState([
    {
      method: 'GET',
      endpoint: '/api/parking-areas',
      status: 200,
      time: '12 Nov 2026, 07:00',
      detail: 'Initial load 6 data area parkir.',
    },
  ]);

  const addApiLog = (method, endpoint, status, detail) => {
    const timeNow = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setApiLogs((prev) => [
      {
        method,
        endpoint,
        status,
        time: `${timeNow}`,
        detail,
      },
      ...prev.slice(0, 19), // simpan 20 log terakhir
    ]);
  };

  // --- REST API SIMULATION FUNCTIONS ---

  // 1. GET /api/parking-areas (Refresh)
  const fetchAreasApi = async () => {
    setRefreshing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setRefreshing(false);
        addApiLog(
          'GET',
          '/api/parking-areas',
          200,
          `Mengambil ${areas.length} data area parkir kampus.`
        );
        resolve(areas);
      }, 700);
    });
  };

  // 2. POST /api/check-in (Mencatat Kendaraan Masuk)
  const postCheckInApi = async (newTicketData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update data tiket
        setTickets((prev) => [newTicketData, ...prev]);

        // Update slot terisi di area bersangkutan (+1)
        setAreas((prev) =>
          prev.map((item) => {
            if (item.id === newTicketData.areaId) {
              const updatedSlot = Math.min(item.kapasitasTotal, item.slotTerisi + 1);
              return { ...item, slotTerisi: updatedSlot };
            }
            return item;
          })
        );

        addApiLog(
          'POST',
          '/api/check-in',
          201,
          `Tiket ${newTicketData.idTiket} (${newTicketData.platNomor}) diterbitkan di ${newTicketData.namaArea}.`
        );
        resolve(newTicketData);
      }, 600);
    });
  };

  // 3. PATCH /api/parking-areas/:id (Update Slot Terisi)
  const patchAreaSlotApi = async (areaId, newSlotTerisi) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let updatedResult = null;
        setAreas((prev) =>
          prev.map((item) => {
            if (item.id === areaId) {
              updatedResult = { ...item, slotTerisi: newSlotTerisi };
              return updatedResult;
            }
            return item;
          })
        );

        addApiLog(
          'PATCH',
          `/api/parking-areas/${areaId}`,
          200,
          `Slot terisi diubah menjadi ${newSlotTerisi}.`
        );
        resolve(updatedResult);
      }, 500);
    });
  };

  // 4. PATCH /api/check-in/:id/checkout (Kendaraan Keluar)
  const patchCheckOutApi = async (ticketId, areaId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Tandai tiket selesai
        setTickets((prev) =>
          prev.map((t) => (t.idTiket === ticketId ? { ...t, status: 'Selesai' } : t))
        );

        // Kurangi slot terisi di area bersangkutan (-1)
        setAreas((prev) =>
          prev.map((item) => {
            if (item.id === areaId) {
              const updatedSlot = Math.max(0, item.slotTerisi - 1);
              return { ...item, slotTerisi: updatedSlot };
            }
            return item;
          })
        );

        addApiLog(
          'PATCH',
          `/api/check-in/${ticketId}/checkout`,
          200,
          `Tiket ${ticketId} checkout selesai. 1 slot dikosongkan.`
        );
        Alert.alert('Checkout Berhasil', `Kendaraan keluar. Slot parkir telah dikembalikan.`);
        resolve(true);
      }, 400);
    });
  };

  // Handler Login & Logout
  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'Petugas') {
      setCurrentTab('petugas');
    } else {
      setCurrentTab('home');
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout =
        typeof window !== 'undefined'
          ? window.confirm('Apakah Anda yakin ingin keluar dari akun?')
          : true;
      if (confirmLogout) {
        setUser(null);
        setCurrentTab('home');
      }
      return;
    }

    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: () => {
          setUser(null);
          setCurrentTab('home');
        },
      },
    ]);
  };

  // Navigasi cepat dari card Home ke Check-In
  const handleNavigateToCheckInFromHome = (area) => {
    setSelectedAreaForCheckIn(area);
    setCurrentTab('checkin');
  };

  // Tampilkan layar Login jika belum terautentikasi
  if (!user) {
    return (
      <View style={styles.appContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <LoginScreen onLogin={handleLogin} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <View style={styles.appBarBrand}>
          <Text style={{ fontSize: 24 }}>🚗</Text>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.appBarTitle}>PARKIN</Text>
            <Text style={styles.appBarSub}>Smart Campus Parking</Text>
          </View>
        </View>

        <View style={styles.appBarActions}>
          <View style={styles.userBadgeTop}>
            <Text style={styles.userBadgeText}>{user.role}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 13, marginRight: 4 }}>🚪</Text>
            <Text style={styles.logoutButtonText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Konten Halaman Berdasarkan Tab */}
      <View style={styles.screenWrapper}>
        {currentTab === 'home' && (
          <HomeScreen
            areas={areas}
            user={user}
            onRefresh={fetchAreasApi}
            refreshing={refreshing}
            onLogout={handleLogout}
            onNavigateToCheckIn={handleNavigateToCheckInFromHome}
            onNavigateToPetugas={() => setCurrentTab('petugas')}
          />
        )}

        {currentTab === 'checkin' && (
          <CheckInScreen
            areas={areas}
            tickets={tickets}
            onCheckIn={postCheckInApi}
            onCheckOut={patchCheckOutApi}
            selectedAreaFromHome={selectedAreaForCheckIn}
          />
        )}

        {currentTab === 'petugas' && (
          <PetugasScreen
            areas={areas}
            onRefreshAreas={fetchAreasApi}
            onPatchSlot={patchAreaSlotApi}
            onPostCheckIn={postCheckInApi}
            apiLogs={apiLogs}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('home')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20 }}>📊</Text>
          <Text style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}>
            Monitoring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('checkin')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20 }}>🎫</Text>
          <Text style={[styles.tabLabel, currentTab === 'checkin' && styles.tabLabelActive]}>
            Check-In / QR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('petugas')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20 }}>🛡️</Text>
          <Text style={[styles.tabLabel, currentTab === 'petugas' && styles.tabLabelActive]}>
            Petugas API
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  appBarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1.2,
  },
  appBarSub: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  appBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userBadgeTop: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  userBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  screenWrapper: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
