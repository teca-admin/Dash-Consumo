/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { fetchFuelData } from './services/dataService';
import { FuelRecord, DashboardStats } from './types';
import Header from './components/Header';
import { StatCard } from './components/SummaryCards';
import { PieChartCard } from './components/FuelCharts';
import PerformanceChart from './components/PerformanceChart';
import OverviewChart from './components/OverviewChart';
import DetailsTable from './components/DetailsTable';
import { Loader2, Fuel, DollarSign } from 'lucide-react';
import { subMonths, startOfMonth, endOfMonth, differenceInDays, subDays } from 'date-fns';

export default function App() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);

  // Filters
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(() => {
    const prevMonth = subMonths(new Date(), 1);
    return {
      from: startOfMonth(prevMonth),
      to: endOfMonth(prevMonth)
    };
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

  const previousPeriodRecords = useMemo(() => {
    if (!data || !dateRange.from || !dateRange.to) return [];
    
    const daysDiff = differenceInDays(dateRange.to, dateRange.from) + 1;
    const prevFrom = subDays(dateRange.from, daysDiff);
    const prevTo = subDays(dateRange.to, daysDiff);

    return data.records.filter(record => {
      const dateMatch = record.date >= prevFrom && record.date <= prevTo;
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
    
    const prevTotalLiters = previousPeriodRecords.reduce((acc, r) => acc + r.liters, 0);
    const prevTotalValue = previousPeriodRecords.reduce((acc, r) => acc + r.value, 0);

    const litersChange = prevTotalLiters > 0 ? ((totalLiters - prevTotalLiters) / prevTotalLiters) * 100 : 0;
    const valueChange = prevTotalValue > 0 ? ((totalValue - prevTotalValue) / prevTotalValue) * 100 : 0;

    return {
      totalLiters,
      totalValue,
      count: filteredRecords.length,
      litersChange,
      valueChange
    };
  }, [filteredRecords, previousPeriodRecords]);

  const litersData = useMemo(() => [
    { name: 'Gasolina', value: filteredRecords.filter(r => r.fuelType === 'Gasolina').reduce((acc, r) => acc + r.liters, 0) },
    { name: 'Diesel S10', value: filteredRecords.filter(r => r.fuelType === 'Diesel S10').reduce((acc, r) => acc + r.liters, 0) }
  ], [filteredRecords]);

  const costData = useMemo(() => [
    { name: 'Gasolina', value: filteredRecords.filter(r => r.fuelType === 'Gasolina').reduce((acc, r) => acc + r.value, 0) },
    { name: 'Diesel S10', value: filteredRecords.filter(r => r.fuelType === 'Diesel S10').reduce((acc, r) => acc + r.value, 0) }
  ], [filteredRecords]);

  const filterOptions = useMemo(() => {
    if (!data) return { ptms: [], equipments: [], providers: [], fuels: ['Diesel S10', 'Gasolina'] };
    return {
      ptms: Array.from(new Set(data.records.map(r => r.ptm).filter(Boolean))).sort(),
      equipments: Array.from(new Set(data.records.map(r => r.equipment).filter(Boolean))).sort(),
      providers: Array.from(new Set(data.records.map(r => r.provider).filter(Boolean))).sort(),
      fuels: ['Diesel S10', 'Gasolina']
    };
  }, [data]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(val);
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50">
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
        onShowSpreadsheet={() => setShowSpreadsheet(true)}
        totalValue={stats.totalValue}
        totalLiters={stats.totalLiters}
      />
      
      <main className="flex-1 p-4 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* Row 1: Pie Charts and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="h-[400px]">
              <PieChartCard 
                title="Custo por Combustível" 
                data={costData} 
                onFilter={(f) => setSelectedFuel(f === selectedFuel ? 'all' : f)} 
                isCurrency 
                percentageChange={stats.valueChange}
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="h-[400px]">
              <PieChartCard 
                title="Litragem por Combustível" 
                data={litersData} 
                onFilter={(f) => setSelectedFuel(f === selectedFuel ? 'all' : f)} 
                unit="L" 
                percentageChange={stats.litersChange}
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="h-[400px]">
              <PerformanceChart records={filteredRecords} />
            </div>
          </div>
        </div>

        {/* Row 2: Table and Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <div className="h-[400px]">
              <DetailsTable records={filteredRecords} />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="h-[400px]">
              <OverviewChart records={filteredRecords} dateRange={dateRange} />
            </div>
          </div>
        </div>
      </main>

      {showSpreadsheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full h-full max-w-6xl rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Planilha de Dados Original</h2>
              <button 
                onClick={() => setShowSpreadsheet(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Loader2 className="h-6 w-6 rotate-45" />
              </button>
            </div>
            <div className="flex-1">
              <iframe 
                src="https://docs.google.com/spreadsheets/d/1WSWIEhbHExsSnKb96LioBWb4rkk3Cv7mRYDhWS7Mfuk/preview" 
                className="w-full h-full border-none"
                title="Google Spreadsheet"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

