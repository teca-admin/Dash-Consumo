import Papa from 'papaparse';
import { FuelRecord, DashboardStats } from '../types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1WSWIEhbHExsSnKb96LioBWb4rkk3Cv7mRYDhWS7Mfuk/export?format=csv';

export async function fetchFuelData(): Promise<DashboardStats> {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: false, // Using indices as requested
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as string[][];
        // Skip header row if it exists (usually row 0)
        const rows = data.slice(1).filter(row => row[0] && row[0] !== 'Data' && row[0] !== 'DATA');

        const records: FuelRecord[] = rows.map((row) => {
          const equipment = row[8] || '';
          // Improved fuel type detection: SPIN and similar are usually Gasoline
          const isGasoline = equipment.toUpperCase().includes('SPIN') || 
                            equipment.toUpperCase().includes('AUTOMÓVEL') ||
                            equipment.toUpperCase().includes('CARRO');
          const fuelType = isGasoline ? 'Gasolina' : 'Diesel S10';
          
          // Parse numbers (handling R$, dots, commas, and quotes)
          const parseNum = (val: string) => {
            if (!val) return 0;
            // Remove R$, spaces, and other non-numeric chars except comma and dot
            const cleaned = val.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
            const num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
          };

          // Parse date (assuming DD/MM/YYYY or similar)
          const parseDate = (val: string) => {
            if (!val) return new Date();
            const parts = val.split('/');
            if (parts.length === 3) {
              const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              return isNaN(d.getTime()) ? new Date() : d;
            }
            const d = new Date(val);
            return isNaN(d.getTime()) ? new Date() : d;
          };

          return {
            date: parseDate(row[0]),
            provider: row[2] || 'Desconhecido',
            liters: parseNum(row[4]),
            value: parseNum(row[7]),
            equipment: equipment,
            ptm: row[11] || '',
            fuelType
          };
        });

        // Calculate stats
        const totalLiters = records.reduce((acc, r) => acc + r.liters, 0);
        const totalValue = records.reduce((acc, r) => acc + r.value, 0);

        const dieselRecords = records.filter(r => r.fuelType === 'Diesel S10');
        const gasolineRecords = records.filter(r => r.fuelType === 'Gasolina');

        const avgPriceDiesel = dieselRecords.length > 0 
          ? dieselRecords.reduce((acc, r) => acc + (r.value / (r.liters || 1)), 0) / dieselRecords.length 
          : 0;
        
        const avgPriceGasoline = gasolineRecords.length > 0 
          ? gasolineRecords.reduce((acc, r) => acc + (r.value / (r.liters || 1)), 0) / gasolineRecords.length 
          : 0;

        resolve({
          totalLiters,
          totalValue,
          avgPriceDiesel,
          avgPriceGasoline,
          records
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
