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
}

export default function SummaryCards({ stats, filteredRecords }: SummaryCardsProps) {
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
      <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Valor Total NF</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalValue)}</h3>
          </div>
          <div className="bg-red-50 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Litros</p>
            <h3 className="text-2xl font-bold mt-1">{formatNumber(stats.totalLiters)} L</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <Fuel className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Provider Specific Cards (Dynamic based on top 2) */}
      {providerStats.map((p, idx) => (
        <Card key={p.name} className={cn(
          "shadow-sm hover:shadow-md transition-shadow overflow-hidden relative",
          idx === 0 ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white" : "bg-gradient-to-br from-purple-800 to-purple-900 text-white"
        )}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest opacity-70">{p.name}</p>
                <p className="text-sm font-medium mt-1">Valor da NF</p>
                <h3 className="text-xl font-bold mt-1">{formatCurrency(p.value)}</h3>
              </div>
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-bold">{p.name.substring(0, 2).toUpperCase()}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs opacity-80">
              <TrendingUp className="h-3 w-3" />
              <span>+2.4% vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
