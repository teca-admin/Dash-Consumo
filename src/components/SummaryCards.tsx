import { Card, CardContent } from './ui/card';
import { FuelRecord } from '../types';
import { Fuel, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  stats: {
    totalLiters: number;
    totalValue: number;
    count: number;
  };
  filteredRecords: FuelRecord[];
  onFilterProvider: (provider: string) => void;
}

export default function SummaryCards({ stats, filteredRecords, onFilterProvider }: SummaryCardsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(val);
  };

  // Calculate provider specific stats
  const providers = Array.from(new Set(filteredRecords.map(r => r.provider)));
  const providerStats = providers.map(p => {
    const records = filteredRecords.filter(r => r.provider === p);
    const value = records.reduce((acc, r) => acc + r.value, 0);
    return { name: p, value };
  }).sort((a, b) => b.value - a.value).slice(0, 2); // Top 2 providers like in the image

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Main Stats */}
      <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 tracking-tight">Valor Total NF</p>
            <h3 className="text-xl font-bold mt-0.5 text-slate-800">{formatCurrency(stats.totalValue)}</h3>
          </div>
          <div className="bg-red-50 p-2.5 rounded-full">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 tracking-tight">Total Litros</p>
            <h3 className="text-xl font-bold mt-0.5 text-slate-800">{formatNumber(stats.totalLiters)} L</h3>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-full">
            <Fuel className="h-5 w-5 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Provider Specific Cards (Dynamic based on top 2) */}
      {providerStats.map((p, idx) => (
        <Card 
          key={p.name} 
          onClick={() => onFilterProvider(p.name)}
          className={cn(
            "shadow-sm hover:shadow-md transition-all overflow-hidden relative cursor-pointer active:scale-95",
            idx === 0 ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-purple-800 to-purple-900 text-white"
          )}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{p.name}</p>
                <p className="text-xs font-medium mt-0.5 opacity-90">Valor da NF</p>
                <h3 className="text-lg font-bold mt-0.5">{formatCurrency(p.value)}</h3>
              </div>
              <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                <span className="text-[10px] font-bold">{p.name.substring(0, 2).toUpperCase()}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] opacity-70">
              <TrendingUp className="h-3 w-3" />
              <span>Clique para filtrar</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
