import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FuelRecord } from '../types';
import { startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { safeFormatDate } from '@/lib/utils';

interface OverviewChartProps {
  records: FuelRecord[];
}

export default function OverviewChart({ records }: OverviewChartProps) {
  // Group by month and provider
  const monthMap = new Map<string, any>();
  const providers = Array.from(new Set(records.map(r => r.provider)));

  records.forEach(r => {
    const monthKey = safeFormatDate(startOfMonth(r.date), 'MMM yyyy', { locale: ptBR });
    if (!monthKey) return;
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { 
        name: monthKey, 
        date: startOfMonth(r.date) 
      });
    }
    const entry = monthMap.get(monthKey);
    entry[r.provider] = (entry[r.provider] || 0) + r.liters;
  });

  const data = Array.from(monthMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const COLORS = ['#0f172a', '#9333ea', '#3b82f6', '#10b981', '#f59e0b'];

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(val));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase text-slate-600">
          Visão Geral - Abastecimentos Mês a Mês (Litros)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${formatNumber(value)} L`, '']}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              {providers.map((p, idx) => (
                <Line 
                  key={p} 
                  type="monotone" 
                  dataKey={p} 
                  stroke={COLORS[idx % COLORS.length]} 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
