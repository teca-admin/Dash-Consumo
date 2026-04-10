/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { fetchFuelData } from './services/dataService';
import { FuelRecord, DashboardStats } from './types';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import FuelCharts from './components/FuelCharts';
import PerformanceChart from './components/PerformanceChart';
import OverviewChart from './components/OverviewChart';
import DetailsTable from './components/DetailsTable';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [selectedPTM, setSelectedPTM] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');

  useEffect(() => {
    fetchFuelData()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecords = useMemo(() => {
    if (!data) return [];
    return data.records.filter(record => {
      const dateMatch = (!dateRange.from || record.date >= dateRange.from) && 
                        (!dateRange.to || record.date <= dateRange.to);
      const ptmMatch = selectedPTM === 'all' || record.ptm === selectedPTM;
      const equipMatch = selectedEquipment === 'all' || record.equipment === selectedEquipment;
      const providerMatch = selectedProvider === 'all' || record.provider === selectedProvider;
      const fuelMatch = selectedFuel === 'all' || record.fuelType === selectedFuel;

      return dateMatch && ptmMatch && equipMatch && providerMatch && fuelMatch;
    });
  }, [data, dateRange, selectedPTM, selectedEquipment, selectedProvider, selectedFuel]);

  const stats = useMemo(() => {
    const totalLiters = filteredRecords.reduce((acc, r) => acc + r.liters, 0);
    const totalValue = filteredRecords.reduce((acc, r) => acc + r.value, 0);
    
    return {
      totalLiters,
      totalValue,
      count: filteredRecords.length
    };
  }, [filteredRecords]);

  const filterOptions = useMemo(() => {
    if (!data) return { ptms: [], equipments: [], providers: [], fuels: ['Diesel S10', 'Gasolina'] };
    return {
      ptms: Array.from(new Set(data.records.map(r => r.ptm).filter(Boolean))).sort(),
      equipments: Array.from(new Set(data.records.map(r => r.equipment).filter(Boolean))).sort(),
      providers: Array.from(new Set(data.records.map(r => r.provider).filter(Boolean))).sort(),
      fuels: ['Diesel S10', 'Gasolina']
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-500">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-sm border border-red-100 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar dados</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header 
        options={filterOptions}
        filters={{
          dateRange,
          selectedPTM,
          selectedEquipment,
          selectedProvider,
          selectedFuel
        }}
        setFilters={{
          setDateRange,
          setSelectedPTM,
          setSelectedEquipment,
          setSelectedProvider,
          setSelectedFuel
        }}
      />
      
      <main className="container mx-auto px-4 mt-6 space-y-6">
        <SummaryCards stats={stats} filteredRecords={filteredRecords} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FuelCharts records={filteredRecords} />
          </div>
          <div className="lg:col-span-2">
            <PerformanceChart records={filteredRecords} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <OverviewChart records={filteredRecords} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <DetailsTable records={filteredRecords} />
        </div>
      </main>
    </div>
  );
}

