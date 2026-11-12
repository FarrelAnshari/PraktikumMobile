import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Platform,
} from 'react-native';

export default function CheckInScreen({
  areas = [],
  tickets = [],
  onCheckIn,
  onCheckOut,
  selectedAreaFromHome,
}) {
  const [activeTab, setActiveTab] = useState('baru'); // 'baru' | 'riwayat'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Motor'); // 'Motor' | 'Mobil'
  const [selectedAreaId, setSelectedAreaId] = useState(
    selectedAreaFromHome?.id || (areas.length > 0 ? areas[0].id : '')
  );

  // Modal untuk menampilkan Tiket Digital setelah Check-in
  const [activeTicketModal, setActiveTicketModal] = useState(null);

  // Filter area yang sesuai tipe kendaraan
  const availableAreas = areas.filter(
    (a) => a.tipeKendaraan === vehicleType && a.slotTerisi < a.kapasitasTotal
  );

  // Simulasi Camera / QR Scan
  const handleSimulateQRScan = () => {
    setIsCameraActive(true);
    // Simulasi scanning selama 1.2 detik
    setTimeout(() => {
      const samplePlates = ['B 4567 SKP', 'D 1984 UGM', 'L 3321 POL', 'AB 6789 UI', 'DK 8899 ITB'];
      const randomPlate = samplePlates[Math.floor(Math.random() * samplePlates.length)];
      setPlateNumber(randomPlate);
      setIsCameraActive(false);
      Alert.alert(
        'QR Berhasil Dipindai',
        `Plat nomor kendaraan terdeteksi dari QR Gerbang: ${randomPlate}`
      );
    }, 1200);
  };

  const handleSubmitCheckIn = () => {
    if (!plateNumber.trim()) {
      Alert.alert('Perhatian', 'Harap isi plat nomor atau lakukan scan QR.');
      return;
    }

    const targetArea = areas.find((a) => a.id === selectedAreaId);
    if (!targetArea) {
      Alert.alert('Perhatian', 'Pilih area parkir yang tersedia.');
      return;
    }

    if (targetArea.slotTerisi >= targetArea.kapasitasTotal) {
      Alert.alert('Area Penuh', 'Maaf, area parkir ini sudah penuh. Pilih area lain.');
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newTicket = {
      idTiket: `TKT-${Date.now().toString().slice(-6)}`,
      platNomor: plateNumber.toUpperCase().trim(),
      jenisKendaraan: vehicleType,
      waktuMasuk: formattedTime,
      areaId: targetArea.id,
      namaArea: targetArea.namaArea,
      status: 'Aktif',
    };

    onCheckIn(newTicket);
    setActiveTicketModal(newTicket);
    setPlateNumber('');
  };

  const handleCheckoutTicket = (ticket) => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined'
          ? window.confirm(
              `Kendaraan dengan plat ${ticket.platNomor} akan keluar dari ${ticket.namaArea}. Slot akan dikosongkan. Lanjutkan?`
            )
          : true;
      if (confirmed) {
        onCheckOut(ticket.idTiket, ticket.areaId);
      }
      return;
    }

    Alert.alert(
      'Konfirmasi Checkout',
      `Kendaraan dengan plat ${ticket.platNomor} akan keluar dari ${ticket.namaArea}. Slot akan dikosongkan. Lanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar (Selesai)',
          style: 'destructive',
          onPress: () => {
            onCheckOut(ticket.idTiket, ticket.areaId);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher: Check-in Baru vs Daftar Tiket */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          style={[styles.topTabButton, activeTab === 'baru' && styles.topTabButtonActive]}
          onPress={() => setActiveTab('baru')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14 }}>➕</Text>
          <Text style={[styles.topTabText, activeTab === 'baru' && styles.topTabTextActive]}>
            Check-In Baru
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topTabButton, activeTab === 'riwayat' && styles.topTabButtonActive]}
          onPress={() => setActiveTab('riwayat')}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14 }}>🎟️</Text>
          <Text style={[styles.topTabText, activeTab === 'riwayat' && styles.topTabTextActive]}>
            Tiket Aktif ({tickets.filter((t) => t.status === 'Aktif').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'baru' ? (
          <View>
            {/* Box Kamera / QR Scanner */}
            <View style={styles.cameraBox}>
              <View style={styles.cameraHeader}>
                <Text style={{ fontSize: 14 }}>📷</Text>
                <Text style={styles.cameraTitle}>Pemindai Kamera / QR Gerbang</Text>
              </View>

              <View style={styles.viewfinder}>
                {isCameraActive ? (
                  <View style={styles.scanningOverlay}>
                    <Text style={{ fontSize: 44 }}>⚡</Text>
                    <Text style={styles.scanningText}>Memindai QR Plat Kendaraan...</Text>
                  </View>
                ) : (
                  <View style={styles.idleCamera}>
                    <Text style={{ fontSize: 40, marginBottom: 6 }}>🔲</Text>
                    <Text style={styles.viewfinderHint}>
                      Arahkan kamera ke QR Gate atau tekan tombol simulasi di bawah
                    </Text>
                  </View>
                )}
                {/* Garis Sudut Viewfinder */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>

              <TouchableOpacity
                style={styles.scanActionBtn}
                onPress={handleSimulateQRScan}
                disabled={isCameraActive}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 14 }}>🔍</Text>
                <Text style={styles.scanActionBtnText}>
                  {isCameraActive ? 'Sedang Memindai...' : 'Simulasikan Scan QR Gerbang'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Input Kendaraan & Area */}
            <View style={styles.formCard}>
              <Text style={styles.formCardTitle}>Data Kendaraan & Lokasi</Text>

              {/* Plat Nomor */}
              <Text style={styles.inputLabel}>Nomor Plat Kendaraan</Text>
              <View style={styles.inputContainer}>
                <Text style={{ fontSize: 15, marginRight: 8 }}>🚗</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Contoh: B 1234 ABC"
                  placeholderTextColor="#94A3B8"
                  value={plateNumber}
                  onChangeText={(val) => setPlateNumber(val.toUpperCase())}
                  autoCapitalize="characters"
                />
              </View>

              {/* Jenis Kendaraan (Motor / Mobil) */}
              <Text style={styles.inputLabel}>Jenis Kendaraan</Text>
              <View style={styles.typeSelector}>
                {[
                  { id: 'Motor', icon: '🏍️' },
                  { id: 'Mobil', icon: '🚗' },
                ].map((item) => {
                  const isSel = vehicleType === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.typeButton, isSel && styles.typeButtonActive]}
                      onPress={() => {
                        setVehicleType(item.id);
                        const firstMatch = areas.find(
                          (a) => a.tipeKendaraan === item.id && a.slotTerisi < a.kapasitasTotal
                        );
                        if (firstMatch) setSelectedAreaId(firstMatch.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                      <Text style={[styles.typeText, isSel && styles.typeTextActive]}>
                        {item.id}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Pilihan Area Parkir */}
              <Text style={styles.inputLabel}>Pilih Area Parkir ({vehicleType})</Text>
              {availableAreas.length === 0 ? (
                <View style={styles.noAreaWarning}>
                  <Text style={{ fontSize: 14 }}>⚠️</Text>
                  <Text style={styles.noAreaText}>
                    Semua area parkir {vehicleType} saat ini sedang penuh!
                  </Text>
                </View>
              ) : (
                <View style={styles.areaRadioGroup}>
                  {availableAreas.map((area) => {
                    const isSelected = selectedAreaId === area.id;
                    const sisa = area.kapasitasTotal - area.slotTerisi;
                    return (
                      <TouchableOpacity
                        key={area.id}
                        style={[styles.areaRadioItem, isSelected && styles.areaRadioItemActive]}
                        onPress={() => setSelectedAreaId(area.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 14, color: isSelected ? '#2563EB' : '#94A3B8' }}>
                          {isSelected ? '🔘' : '⚪'}
                        </Text>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text
                            style={[
                              styles.areaRadioName,
                              isSelected && { color: '#1E40AF', fontWeight: '700' },
                            ]}
                          >
                            {area.namaArea}
                          </Text>
                          <Text style={styles.areaRadioSubtitle}>
                            Sisa slot: <Text style={{ color: '#10B981' }}>{sisa}</Text> dari{' '}
                            {area.kapasitasTotal}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Submit Check-in Button */}
              <TouchableOpacity
                style={[
                  styles.checkInSubmitBtn,
                  availableAreas.length === 0 && { backgroundColor: '#94A3B8' },
                ]}
                onPress={handleSubmitCheckIn}
                disabled={availableAreas.length === 0}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 16 }}>✅</Text>
                <Text style={styles.checkInSubmitText}>Cetak & Terbitkan Tiket Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Tab Riwayat Tiket */
          <View>
            <Text style={styles.historySectionTitle}>Daftar Tiket Kendaraan Kampus</Text>
            {tickets.length === 0 ? (
              <View style={styles.emptyTicketBox}>
                <Text style={{ fontSize: 32 }}>🎟️</Text>
                <Text style={styles.emptyTicketText}>Belum ada tiket yang diterbitkan.</Text>
              </View>
            ) : (
              tickets.map((t) => (
                <View
                  key={t.idTiket}
                  style={[
                    styles.ticketCard,
                    t.status === 'Selesai' && styles.ticketCardDone,
                  ]}
                >
                  <View style={styles.ticketCardHeader}>
                    <View>
                      <Text style={styles.ticketIdText}>{t.idTiket}</Text>
                      <Text style={styles.ticketAreaText}>{t.namaArea}</Text>
                    </View>
                    <View
                      style={[
                        styles.ticketStatusTag,
                        t.status === 'Aktif'
                          ? { backgroundColor: '#D1FAE5' }
                          : { backgroundColor: '#F1F5F9' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.ticketStatusText,
                          t.status === 'Aktif' ? { color: '#059669' } : { color: '#64748B' },
                        ]}
                      >
                        {t.status === 'Aktif' ? '● Aktif' : '✓ Selesai'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ticketDivider} />

                  <View style={styles.ticketBodyRow}>
                    <View>
                      <Text style={styles.ticketBodyLabel}>Plat Nomor</Text>
                      <Text style={styles.ticketPlateVal}>{t.platNomor}</Text>
                    </View>
                    <View>
                      <Text style={styles.ticketBodyLabel}>Kendaraan</Text>
                      <Text style={styles.ticketBodyVal}>{t.jenisKendaraan}</Text>
                    </View>
                    <View>
                      <Text style={styles.ticketBodyLabel}>Waktu Masuk</Text>
                      <Text style={styles.ticketBodyVal}>{t.waktuMasuk}</Text>
                    </View>
                  </View>

                  {/* Action Tombol Checkout jika status masih Aktif */}
                  {t.status === 'Aktif' && (
                    <View style={styles.ticketFooterAction}>
                      <TouchableOpacity
                        style={styles.viewQrMiniBtn}
                        onPress={() => setActiveTicketModal(t)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 12 }}>📱</Text>
                        <Text style={styles.viewQrMiniText}>Lihat QR</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={() => handleCheckoutTicket(t)}
                        activeOpacity={0.8}
                      >
                        <Text style={{ fontSize: 12 }}>🚪</Text>
                        <Text style={styles.checkoutBtnText}>Checkout Keluar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* MODAL TIKET DIGITAL */}
      <Modal
        visible={!!activeTicketModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveTicketModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Header Tiket */}
            <View style={styles.modalTicketTop}>
              <Text style={{ fontSize: 28 }}>🛡️</Text>
              <Text style={styles.modalParkinTitle}>PARKIN E-TICKET</Text>
              <Text style={styles.modalTicketSub}>Smart Campus Parking Access</Text>
            </View>

            {/* QR Mock Visual */}
            <View style={styles.qrMockContainer}>
              <View style={styles.qrMatrixBox}>
                <Text style={styles.qrMatrixSymbol}>█▀▀▀▀▀█ ▄ █▀▀▀▀▀█</Text>
                <Text style={styles.qrMatrixSymbol}>█ ███ █ █ █ ███ █</Text>
                <Text style={styles.qrMatrixSymbol}>█ ▀▀▀ █ ▄ █ ▀▀▀ █</Text>
                <Text style={styles.qrMatrixSymbol}>▀▀▀▀▀▀▀ ▀ ▀▀▀▀▀▀▀</Text>
                <Text style={styles.qrMatrixSymbol}>▄▀▄ █▄▄▀ ▀▄█ ▀▄▄</Text>
                <Text style={styles.qrMatrixSymbol}>█▀▀▀▀▀█ ▄ ▄▀▄ ▄ █</Text>
                <Text style={styles.qrMatrixSymbol}>█ ███ █ █▀█ █ ▀ █</Text>
              </View>
              <Text style={styles.qrCodeString}>{activeTicketModal?.idTiket}</Text>
            </View>

            {/* Detail Tiket */}
            <View style={styles.modalDetails}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Plat Nomor</Text>
                <Text style={styles.modalValuePlate}>{activeTicketModal?.platNomor}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Area Parkir</Text>
                <Text style={styles.modalValue}>{activeTicketModal?.namaArea}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Tipe Kendaraan</Text>
                <Text style={styles.modalValue}>{activeTicketModal?.jenisKendaraan}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Waktu Masuk</Text>
                <Text style={styles.modalValue}>{activeTicketModal?.waktuMasuk}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Status</Text>
                <Text style={[styles.modalValue, { color: '#059669', fontWeight: '800' }]}>
                  {activeTicketModal?.status}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setActiveTicketModal(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeModalText}>Tutup Tiket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRadius: 8,
  },
  topTabButtonActive: {
    backgroundColor: '#EFF6FF',
  },
  topTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  topTabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cameraBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cameraTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewfinder: {
    width: '100%',
    height: 180,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  idleCamera: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  viewfinderHint: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  scanningOverlay: {
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38BDF8',
    marginTop: 8,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#38BDF8',
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  scanActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 14,
    gap: 8,
  },
  scanActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    gap: 6,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: '#2563EB',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  areaRadioGroup: {
    gap: 8,
  },
  areaRadioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  areaRadioItemActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  areaRadioName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  areaRadioSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  noAreaWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  noAreaText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '600',
  },
  checkInSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
    gap: 6,
  },
  checkInSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historySectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  emptyTicketBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTicketText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ticketCardDone: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
  },
  ticketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ticketIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  ticketAreaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ticketStatusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ticketStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  ticketDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  ticketBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketBodyLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  ticketPlateVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 2,
  },
  ticketBodyVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
  ticketFooterAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  viewQrMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    gap: 4,
  },
  viewQrMiniText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    gap: 4,
  },
  checkoutBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTicketTop: {
    alignItems: 'center',
    marginBottom: 12,
  },
  modalParkinTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  modalTicketSub: {
    fontSize: 11,
    color: '#64748B',
  },
  qrMockContainer: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginVertical: 10,
  },
  qrMatrixBox: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrMatrixSymbol: {
    color: '#38BDF8',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
    lineHeight: 14,
  },
  qrCodeString: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
  },
  modalDetails: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginVertical: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  modalValuePlate: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  modalValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  closeModalBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  closeModalText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
