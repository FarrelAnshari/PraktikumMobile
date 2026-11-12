import { ParkingArea, ParkingStats, VehicleType } from '../types/parking';

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function formatTanggalWaktu(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateParkingStatistics(areas: ParkingArea[]): ParkingStats {
  if (areas.length === 0) {
    return {
      totalKapasitas: 0,
      totalTerisi: 0,
      totalTersedia: 0,
      rataRataOccupancy: 0,
      areaTerpadat: '-',
    };
  }

  let totalKapasitas = 0;
  let totalTerisi = 0;
  let maxOccupancy = -1;
  let areaTerpadatNama = '-';

  for (const item of areas) {
    totalKapasitas += item.kapasitasTotal;
    totalTerisi += item.slotTerisi;

    const occupancyRate = (item.slotTerisi / item.kapasitasTotal) * 100;
    if (occupancyRate > maxOccupancy) {
      maxOccupancy = occupancyRate;
      areaTerpadatNama = `${item.namaArea} (${Math.round(occupancyRate)}%)`;
    }
  }

  const totalTersedia = Math.max(0, totalKapasitas - totalTerisi);

  const totalPercentage = areas.reduce((accumulator: number, current: ParkingArea) => {
    const rate = current.kapasitasTotal > 0 ? (current.slotTerisi / current.kapasitasTotal) * 100 : 0;
    return accumulator + rate;
  }, 0);

  const rataRataOccupancy = Math.round(totalPercentage / areas.length);

  return {
    totalKapasitas,
    totalTerisi,
    totalTersedia,
    rataRataOccupancy,
    areaTerpadat: areaTerpadatNama,
  };
}

export function groupAreasByVehicleType(areas: ParkingArea[]): Record<VehicleType, ParkingArea[]> {
  const grouped: Record<VehicleType, ParkingArea[]> = {
    Motor: [],
    Mobil: [],
  };

  areas.forEach((area: ParkingArea) => {
    if (area.tipeKendaraan === 'Mobil') {
      grouped.Mobil.push(area);
    } else {
      grouped.Motor.push(area);
    }
  });

  return grouped;
}

export function getTopAvailableAreas(areas: ParkingArea[], limit: number = 5): ParkingArea[] {

  const availableOnly: ParkingArea[] = areas.filter(
    (a: ParkingArea) => a.kapasitasTotal - a.slotTerisi > 0
  );

  availableOnly.sort(
    (a, b) => b.kapasitasTotal - b.slotTerisi - (a.kapasitasTotal - a.slotTerisi)
  );

  const result: ParkingArea[] = [];

  for (let i = 0; i < availableOnly.length && i < limit; i++) {
    result.push(availableOnly[i]);
  }

  return result;
}

