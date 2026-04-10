export interface FuelRecord {
  date: Date;
  provider: string;
  liters: number;
  value: number;
  equipment: string;
  ptm: string;
  fuelType: 'Diesel S10' | 'Gasolina';
}

export interface DashboardStats {
  totalLiters: number;
  totalValue: number;
  avgPriceDiesel: number;
  avgPriceGasoline: number;
  records: FuelRecord[];
}
