import { ApiResponse, VehicleItem } from '../types/vehicle';
import { delay } from '../utils/delay';

const BASE_URL = 'https://dummyjson.com/products';

export async function getVehicles(): Promise<VehicleItem[]> {

  await delay(600);

  const response = await fetch(`${BASE_URL}/category/vehicle`);

  if (!response.ok) {
    throw new Error(`HTTP Error: Gagal mengambil data kendaraan (${response.status})`);
  }

  const json: ApiResponse<VehicleItem[]> = await response.json();
  return json.products;
}

export async function getVehicleById(id: string | number): Promise<VehicleItem> {
  await delay(400);

  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Kendaraan dengan ID ${id} tidak ditemukan (Status: ${response.status})`);
  }

  const data: VehicleItem = await response.json();
  return data;
}

export function fetchVehiclesWithPromise(): Promise<VehicleItem[]> {

  return new Promise<VehicleItem[]>((resolve, reject) => {
    fetch(`${BASE_URL}/category/vehicle`)
      .then((res) => {

        if (!res.ok) {

          reject(`Server error! Status Code: ${res.status} ${res.statusText}`);
          return;
        }
        return res.json();
      })
      .then((data: ApiResponse<VehicleItem[]>) => {
        if (data && data.products) {

          resolve(data.products);
        } else {

          reject('Struktur data JSON tidak valid dari server API.');
        }
      })
      .catch((err) => {

        reject(`Network Failure: ${err?.message || 'Gagal terhubung ke External API'}`);
      });
  });
}

