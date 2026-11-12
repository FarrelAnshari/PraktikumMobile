import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

export default function HomeScreen({
  areas = [],
  onRefresh,
  refreshing = false,
  user,
  onNavigateToCheckIn,
  onNavigateToPetugas,
}) {
  const [filterType, setFilterType] = useState('Semua'); // 'Semua' | 'Motor' | 'Mobil'
  const [searchQuery, setSearchQuery] = useState('');

  // Perhitungan status dan indikator warna sesuai aturan praktikum
  const getStatusInfo = (occupancy, slotTersedia) => {
    if (occupancy >= 90 || slotTersedia <= 0) {
      return {
        label: 'Penuh',
        color: '#EF4444', // Merah
        bg: '#FEE2E2',
        border: '#FCA5A5',
      };
    } else if (occupancy >= 70) {
      return {
        label: 'Ramai',
        color: '#D97706', // Kuning/Amber
        bg: '#FEF3C7',
        border: '#FCD34D',
      };
    } else {
      return {
        label: 'Tersedia',
        color: '#10B981', // Hijau
        bg: '#D1FAE5',
        border: '#6EE7B7',
      };
    }
  };

  // Filter list
  const filteredAreas = areas.filter((item) => {
    const matchType = filterType === 'Semua' ? true : item.tipeKendaraan === filterType;
    const matchSearch = item.namaArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  // Ringkasan Total
  const totalKapasitas = areas.reduce((sum, item) => sum + item.kapasitasTotal, 0);
  const totalTerisi = areas.reduce((sum, item) => sum + item.slotTerisi, 0);
  const totalTersedia = areas.reduce(
    (sum, item) => sum + Math.max(0, item.kapasitasTotal - item.slotTerisi),
    0
  );
  const totalPersen = totalKapasitas > 0 ? Math.round((totalTerisi / totalKapasitas) * 100) : 0;

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      {/* User Greeting Bar */}
      <View style={styles.userBar}>
        <View>
          <Text style={styles.greetingTitle}>Halo, {user?.name || 'Sobat Kampus'} 👋</Text>
          <View style={styles.userRoleTag}>
            <Text style={styles.roleIconSmall}>
              {user?.role === 'Mahasiswa' ? '🎓' : user?.role === 'Dosen' ? '👨‍🏫' : '🛡️'}
            </Text>
            <Text style={styles.userRoleText}>
              {user?.role || 'Pengguna'} • {user?.id || '-'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.refreshRoundButton}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16 }}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Ringkasan Dashboard Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <Text style={styles.summaryTitle}>Kapasitas Parkir Kampus</Text>
          <Text style={styles.summaryBadge}>{totalPersen}% Terpakai</Text>
        </View>

        {/* Progress Bar Keseluruhan */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(totalPersen, 100)}%`,
                backgroundColor:
                  totalPersen >= 90 ? '#EF4444' : totalPersen >= 70 ? '#F59E0B' : '#10B981',
              },
            ]}
          />
        </View>

        {/* Kolom Indikator Angka */}
        <View style={styles.summaryStatsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>{totalKapasitas}</Text>
            <Text style={styles.statLabel}>Total Slot</Text>
          </View>
          <View style={[styles.statCol, styles.statBorder]}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>{totalTerisi}</Text>
            <Text style={styles.statLabel}>Terisi</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{totalTersedia}</Text>
            <Text style={styles.statLabel}>Tersedia</Text>
          </View>
        </View>
      </View>

      {/* Legend Indikator Status Warna */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendHeaderTitle}>Indikator Ketersediaan:</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Hijau: Tersedia (&lt;70%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Kuning: Ramai (70-89%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Merah: Penuh (≥90%)</Text>
          </View>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Text style={{ fontSize: 14, marginRight: 6 }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama area parkir..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '700' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs (Semua, Motor, Mobil) */}
      <View style={styles.filterTabs}>
        {[
          { type: 'Semua', icon: '▦' },
          { type: 'Motor', icon: '🏍️' },
          { type: 'Mobil', icon: '🚗' },
        ].map((item) => {
          const active = filterType === item.type;
          return (
            <TouchableOpacity
              key={item.type}
              style={[styles.filterTabButton, active && styles.filterTabButtonActive]}
              onPress={() => setFilterType(item.type)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 13 }}>{item.icon}</Text>
              <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                {item.type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          Area Parkir Kampus ({filteredAreas.length})
        </Text>
        <Text style={styles.sectionHint}>● Update Real-Time</Text>
      </View>
    </View>
  );

  const renderAreaItem = ({ item }) => {
    const slotTersedia = Math.max(0, item.kapasitasTotal - item.slotTerisi);
    const occupancy =
      item.kapasitasTotal > 0 ? Math.round((item.slotTerisi / item.kapasitasTotal) * 100) : 0;
    const status = getStatusInfo(occupancy, slotTersedia);

    return (
      <View style={[styles.areaCard, { borderLeftColor: status.color }]}>
        <View style={styles.areaCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.areaName}>{item.namaArea}</Text>
            <View style={styles.vehicleTypeBadge}>
              <Text style={{ fontSize: 12 }}>{item.tipeKendaraan === 'Mobil' ? '🚗' : '🏍️'}</Text>
              <Text style={styles.vehicleTypeText}>Khusus {item.tipeKendaraan}</Text>
            </View>
          </View>

          {/* Status Badge Warna */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status.bg, borderColor: status.border },
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusBadgeText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Occupancy Bar */}
        <View style={styles.areaOccupancyContainer}>
          <View style={styles.areaOccupancyLabels}>
            <Text style={styles.occupancyText}>
              Occupancy: <Text style={{ fontWeight: '700' }}>{occupancy}%</Text>
            </Text>
            <Text style={styles.slotRemainingText}>
              Tersedia: <Text style={{ fontWeight: '700', color: status.color }}>{slotTersedia}</Text> / {item.kapasitasTotal}
            </Text>
          </View>

          <View style={styles.areaProgressBarTrack}>
            <View
              style={[
                styles.areaProgressBarFill,
                { width: `${Math.min(occupancy, 100)}%`, backgroundColor: status.color },
              ]}
            />
          </View>
        </View>

        {/* Detail Angka Slot */}
        <View style={styles.areaFooterRow}>
          <View style={styles.footerInfoBox}>
            <Text style={styles.footerInfoLabel}>Kapasitas</Text>
            <Text style={styles.footerInfoVal}>{item.kapasitasTotal}</Text>
          </View>
          <View style={styles.footerInfoBox}>
            <Text style={styles.footerInfoLabel}>Terisi</Text>
            <Text style={[styles.footerInfoVal, { color: '#EF4444' }]}>{item.slotTerisi}</Text>
          </View>
          <View style={styles.footerInfoBox}>
            <Text style={styles.footerInfoLabel}>Sisa Slot</Text>
            <Text style={[styles.footerInfoVal, { color: status.color }]}>{slotTersedia}</Text>
          </View>

          {/* Action Button: Check In / Tiket */}
          <TouchableOpacity
            style={[
              styles.checkInQuickBtn,
              slotTersedia === 0 && { backgroundColor: '#94A3B8' },
            ]}
            onPress={() => onNavigateToCheckIn(item)}
            disabled={slotTersedia === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.checkInQuickBtnText}>
              {slotTersedia === 0 ? 'Penuh' : 'Check-In'}
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 11, marginLeft: 4 }}>🎫</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredAreas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAreaItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32 }}>🔍</Text>
            <Text style={styles.emptyText}>Tidak ada area parkir yang sesuai filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  headerBlock: {
    marginBottom: 8,
  },
  userBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRoleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  roleIconSmall: {
    fontSize: 12,
  },
  userRoleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  refreshRoundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  summaryBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  legendContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  filterTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  filterTabButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionHint: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  areaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  areaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  areaName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  vehicleTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleTypeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  areaOccupancyContainer: {
    marginBottom: 12,
  },
  areaOccupancyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  occupancyText: {
    fontSize: 11,
    color: '#475569',
  },
  slotRemainingText: {
    fontSize: 11,
    color: '#475569',
  },
  areaProgressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  areaProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  areaFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerInfoBox: {
    alignItems: 'center',
  },
  footerInfoLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  footerInfoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  checkInQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  checkInQuickBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 10,
  },
});
