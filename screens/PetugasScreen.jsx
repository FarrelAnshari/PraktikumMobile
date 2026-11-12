import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

export default function PetugasScreen({
  areas = [],
  onRefreshAreas,
  onPatchSlot,
  onPostCheckIn,
  apiLogs = [],
}) {
  const [selectedAreaId, setSelectedAreaId] = useState(areas.length > 0 ? areas[0].id : '');
  const [postPlate, setPostPlate] = useState('B 9999 PKN');
  const [postVehicle, setPostVehicle] = useState('Motor');
  const [activeTab, setActiveTab] = useState('patch'); // 'patch' | 'post' | 'logs'
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [latestApiResponse, setLatestApiResponse] = useState(null);

  const currentArea = areas.find((a) => a.id === selectedAreaId) || areas[0];

  // Eksekusi GET Request
  const handleExecuteGet = async () => {
    setIsLoadingApi(true);
    try {
      const res = await onRefreshAreas();
      setLatestApiResponse({
        method: 'GET',
        endpoint: '/api/parking-areas',
        status: 200,
        statusText: '200 OK',
        data: res || areas,
      });
      Alert.alert('GET Berhasil', 'Data area parkir berhasil diambil dari API (200 OK).');
    } catch (e) {
      Alert.alert('Error', 'Gagal mengambil data dari API.');
    } finally {
      setIsLoadingApi(false);
    }
  };

  // Eksekusi POST Request (Mencatat Kendaraan Masuk)
  const handleExecutePost = async () => {
    if (!postPlate.trim()) {
      Alert.alert('Peringatan', 'Plat nomor tidak boleh kosong.');
      return;
    }
    if (!currentArea) {
      Alert.alert('Peringatan', 'Pilih area parkir tujuan.');
      return;
    }
    if (currentArea.slotTerisi >= currentArea.kapasitasTotal) {
      Alert.alert('Area Penuh', 'Area ini sudah mencapai kapasitas maksimal.');
      return;
    }

    setIsLoadingApi(true);
    try {
      const payload = {
        platNomor: postPlate.toUpperCase().trim(),
        jenisKendaraan: postVehicle,
        areaId: currentArea.id,
        namaArea: currentArea.namaArea,
      };

      const result = await onPostCheckIn(payload);
      setLatestApiResponse({
        method: 'POST',
        endpoint: '/api/check-in',
        status: 201,
        statusText: '201 Created',
        data: result,
      });
      Alert.alert(
        'POST Sukses (201 Created)',
        `Kendaraan ${postPlate.toUpperCase()} berhasil dicatat masuk ke ${currentArea.namaArea}.`
      );
      setPostPlate('');
    } catch (err) {
      Alert.alert('Error', 'Gagal mencatat kendaraan.');
    } finally {
      setIsLoadingApi(false);
    }
  };

  // Eksekusi PATCH Request (Memperbarui Slot Parkir)
  const handleExecutePatch = async (delta) => {
    if (!currentArea) return;
    const newTerisi = currentArea.slotTerisi + delta;

    if (newTerisi < 0) {
      Alert.alert('Batas Minimum', 'Slot terisi tidak boleh kurang dari 0.');
      return;
    }
    if (newTerisi > currentArea.kapasitasTotal) {
      Alert.alert('Batas Maksimum', 'Slot terisi tidak boleh melebihi kapasitas total.');
      return;
    }

    setIsLoadingApi(true);
    try {
      const updatedArea = await onPatchSlot(currentArea.id, newTerisi);
      setLatestApiResponse({
        method: 'PATCH',
        endpoint: `/api/parking-areas/${currentArea.id}`,
        status: 200,
        statusText: '200 OK',
        data: updatedArea,
      });
    } catch (err) {
      Alert.alert('Error', 'Gagal memperbarui status slot.');
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Petugas */}
      <View style={styles.bannerPetugas}>
        <View style={styles.badgeRow}>
          <View style={styles.liveApiBadge}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveApiText}>REST API ENGINE ONLINE</Text>
          </View>
          <Text style={styles.bannerRole}>Pos Pengendali Parkir</Text>
        </View>
        <Text style={styles.bannerTitle}>Operasional Petugas Parkir</Text>
        <Text style={styles.bannerDesc}>
          Pengendalian ketersediaan slot melalui protokol REST (GET, POST, PATCH, Refresh).
        </Text>
      </View>

      {/* Quick Action GET / Refresh Button */}
      <View style={styles.apiActionBar}>
        <TouchableOpacity
          style={styles.apiGetButton}
          onPress={handleExecuteGet}
          disabled={isLoadingApi}
          activeOpacity={0.8}
        >
          {isLoadingApi ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={{ fontSize: 15, color: '#FFFFFF' }}>📥</Text>
              <Text style={styles.apiGetButtonText}>GET /api/parking-areas (Refresh Data)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Tab Menu Operasional */}
      <View style={styles.segmentedTab}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'patch' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('patch')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentText, activeTab === 'patch' && styles.segmentTextActive]}>
            ⚙️ PATCH Slot
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'post' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('post')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentText, activeTab === 'post' && styles.segmentTextActive]}>
            📝 POST Check-In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'logs' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('logs')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentText, activeTab === 'logs' && styles.segmentTextActive]}>
            📋 Logs ({apiLogs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: PATCH SLOT AREA */}
      {activeTab === 'patch' && (
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeader}>⚙️ Kelola Slot Parkir (PATCH)</Text>
          <Text style={styles.sectionSub}>
            Pilih area parkir untuk menambah atau mengurangi slot terisi secara langsung via PATCH API.
          </Text>

          {/* Area Selector Pill */}
          <Text style={styles.label}>Pilih Area Parkir:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.areaScroll}>
            {areas.map((a) => {
              const isSel = (currentArea?.id || '') === a.id;
              return (
                <TouchableOpacity
                  key={a.id}
                  style={[styles.areaPill, isSel && styles.areaPillActive]}
                  onPress={() => setSelectedAreaId(a.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.areaPillText, isSel && styles.areaPillTextActive]}>
                    {a.namaArea}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Current Status Box */}
          {currentArea && (
            <View style={styles.slotControlBox}>
              <View style={styles.slotHeaderRow}>
                <View>
                  <Text style={styles.slotAreaTitle}>{currentArea.namaArea}</Text>
                  <Text style={styles.slotSubTitle}>
                    Tipe: {currentArea.tipeKendaraan} • Kapasitas: {currentArea.kapasitasTotal}
                  </Text>
                </View>
                <View
                  style={[
                    styles.miniBadge,
                    {
                      backgroundColor:
                        currentArea.slotTerisi >= currentArea.kapasitasTotal
                          ? '#FEE2E2'
                          : '#D1FAE5',
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color:
                        currentArea.slotTerisi >= currentArea.kapasitasTotal
                          ? '#EF4444'
                          : '#10B981',
                    }}
                  >
                    {currentArea.slotTerisi >= currentArea.kapasitasTotal ? 'Penuh' : 'Tersedia'}
                  </Text>
                </View>
              </View>

              {/* Slot Indicator Numbers */}
              <View style={styles.slotCounterRow}>
                <View style={styles.counterItem}>
                  <Text style={styles.counterVal}>{currentArea.kapasitasTotal}</Text>
                  <Text style={styles.counterLbl}>Kapasitas</Text>
                </View>
                <View style={styles.counterItem}>
                  <Text style={[styles.counterVal, { color: '#EF4444' }]}>
                    {currentArea.slotTerisi}
                  </Text>
                  <Text style={styles.counterLbl}>Terisi</Text>
                </View>
                <View style={styles.counterItem}>
                  <Text style={[styles.counterVal, { color: '#10B981' }]}>
                    {Math.max(0, currentArea.kapasitasTotal - currentArea.slotTerisi)}
                  </Text>
                  <Text style={styles.counterLbl}>Sisa Kosong</Text>
                </View>
              </View>

              {/* Action Buttons (+ / -) */}
              <View style={styles.patchButtonsRow}>
                <TouchableOpacity
                  style={[styles.patchBtn, styles.patchBtnMinus]}
                  onPress={() => handleExecutePatch(-1)}
                  disabled={isLoadingApi || currentArea.slotTerisi <= 0}
                  activeOpacity={0.7}
                >
                  <Text style={styles.patchBtnText}>➖ Slot Keluar (-1)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.patchBtn, styles.patchBtnPlus]}
                  onPress={() => handleExecutePatch(1)}
                  disabled={
                    isLoadingApi || currentArea.slotTerisi >= currentArea.kapasitasTotal
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.patchBtnText}>➕ Slot Masuk (+1)</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.apiTriggerHint}>
                ⚡ Menjalankan HTTP PATCH: /api/parking-areas/{currentArea.id}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* TAB 2: POST CHECK-IN GERBANG */}
      {activeTab === 'post' && (
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeader}>📝 Catat Masuk Gerbang (POST)</Text>
          <Text style={styles.sectionSub}>
            Mencatat kendaraan masuk secara langsung dari pos petugas via endpoint POST /api/check-in.
          </Text>

          <Text style={styles.label}>Nomor Plat Kendaraan:</Text>
          <TextInput
            style={styles.formInput}
            value={postPlate}
            onChangeText={(v) => setPostPlate(v.toUpperCase())}
            placeholder="Masukkan plat nomor"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Jenis Kendaraan:</Text>
          <View style={styles.vehiclePickRow}>
            {[
              { id: 'Motor', icon: '🏍️' },
              { id: 'Mobil', icon: '🚗' },
            ].map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.vehPill, postVehicle === t.id && styles.vehPillActive]}
                onPress={() => setPostVehicle(t.id)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 13 }}>{t.icon}</Text>
                <Text
                  style={[styles.vehPillText, postVehicle === t.id && styles.vehPillTextActive]}
                >
                  {t.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Area Parkir Tujuan:</Text>
          <View style={styles.areaRadioList}>
            {areas
              .filter((a) => a.tipeKendaraan === postVehicle)
              .map((area) => {
                const isSelected = (currentArea?.id || '') === area.id;
                const isFull = area.slotTerisi >= area.kapasitasTotal;
                return (
                  <TouchableOpacity
                    key={area.id}
                    style={[
                      styles.areaOption,
                      isSelected && styles.areaOptionSelected,
                      isFull && { opacity: 0.5 },
                    ]}
                    onPress={() => setSelectedAreaId(area.id)}
                    disabled={isFull}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 14 }}>{isSelected ? '🔘' : '⚪'}</Text>
                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <Text style={styles.areaOptionName}>{area.namaArea}</Text>
                      <Text style={styles.areaOptionCap}>
                        Slot terisi: {area.slotTerisi}/{area.kapasitasTotal}{' '}
                        {isFull ? '(PENUH)' : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>

          <TouchableOpacity
            style={styles.postSubmitBtn}
            onPress={handleExecutePost}
            disabled={isLoadingApi}
            activeOpacity={0.8}
          >
            {isLoadingApi ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={{ fontSize: 14 }}>🚀</Text>
                <Text style={styles.postSubmitText}>Kirim POST /api/check-in</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* TAB 3: HTTP API LOGS & JSON RESPONSE */}
      {activeTab === 'logs' && (
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeader}>📋 Riwayat REST API HTTP</Text>
          <Text style={styles.sectionSub}>
            Memantau interaksi request & response HTTP protokol REST secara real-time untuk praktikum.
          </Text>

          {/* Response Box Terbaru */}
          {latestApiResponse && (
            <View style={styles.latestResBox}>
              <View style={styles.latestResHeader}>
                <Text style={styles.latestResTag}>{latestApiResponse.method}</Text>
                <Text style={styles.latestResStatus}>{latestApiResponse.statusText}</Text>
              </View>
              <Text style={styles.latestResEndpoint}>{latestApiResponse.endpoint}</Text>
              <Text style={styles.jsonPreview}>
                {JSON.stringify(latestApiResponse.data, null, 2)}
              </Text>
            </View>
          )}

          {/* List Log */}
          {apiLogs.length === 0 ? (
            <View style={styles.emptyLogBox}>
              <Text style={styles.emptyLogText}>Belum ada riwayat aktivitas API.</Text>
            </View>
          ) : (
            apiLogs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={styles.logHeaderRow}>
                  <View
                    style={[
                      styles.methodBadge,
                      log.method === 'GET'
                        ? { backgroundColor: '#3B82F6' }
                        : log.method === 'POST'
                        ? { backgroundColor: '#10B981' }
                        : { backgroundColor: '#F59E0B' },
                    ]}
                  >
                    <Text style={styles.methodBadgeText}>{log.method}</Text>
                  </View>
                  <Text style={styles.logEndpoint}>{log.endpoint}</Text>
                  <Text style={styles.logStatusCode}>{log.status}</Text>
                </View>
                <Text style={styles.logTime}>{log.time}</Text>
                {log.detail && (
                  <Text style={styles.logDetailText}>Detail: {log.detail}</Text>
                )}
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  bannerPetugas: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveApiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveApiText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  bannerRole: {
    fontSize: 11,
    color: '#94A3B8',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  apiActionBar: {
    marginBottom: 12,
  },
  apiGetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  apiGetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  segmentedTab: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    marginTop: 8,
  },
  areaScroll: {
    marginBottom: 14,
  },
  areaPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  areaPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  areaPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  areaPillTextActive: {
    color: '#FFFFFF',
  },
  slotControlBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  slotAreaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  slotSubTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  slotCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  counterItem: {
    flex: 1,
    alignItems: 'center',
  },
  counterVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  counterLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  patchButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  patchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  patchBtnMinus: {
    backgroundColor: '#EF4444',
  },
  patchBtnPlus: {
    backgroundColor: '#10B981',
  },
  patchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  apiTriggerHint: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  vehiclePickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vehPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    gap: 6,
  },
  vehPillActive: {
    backgroundColor: '#2563EB',
  },
  vehPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  vehPillTextActive: {
    color: '#FFFFFF',
  },
  areaRadioList: {
    gap: 8,
    marginTop: 4,
    marginBottom: 14,
  },
  areaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  areaOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  areaOptionName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  areaOptionCap: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  postSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  postSubmitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  latestResBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  latestResHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  latestResTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
  },
  latestResStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  latestResEndpoint: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 8,
  },
  jsonPreview: {
    fontSize: 10.5,
    color: '#F8FAFC',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 6,
  },
  emptyLogBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyLogText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  logItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logEndpoint: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
  },
  logStatusCode: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },
  logTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  logDetailText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
});
