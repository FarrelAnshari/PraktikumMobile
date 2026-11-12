

export type VehicleType = 'Motor' | 'Mobil';
export type ParkingStatus = 'Tersedia' | 'Ramai' | 'Penuh';

export interface ParkingArea {
  id: string;
  namaArea: string;
  kapasitasTotal: number;
  slotTerisi: number;
  tipeKendaraan: VehicleType;
  status: ParkingStatus;
  tarifPerJam?: number;
  lokasiGedung?: string;
  lantai?: number;
}

export interface ParkingStats {
  totalKapasitas: number;
  totalTerisi: number;
  totalTersedia: number;
  rataRataOccupancy: number;
  areaTerpadat: string;
}

