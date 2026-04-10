import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FuelRecord } from '../types';
import { startOfMonth, startOfDay, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { safeFormatDate } from '@/lib/utils';

interface OverviewChartProps {
  records: FuelRecord[];
  dateRange: { from: Date | undefined; to: Date | undefined };
}

export default function OverviewChart({ records, dateRange }: OverviewChartProps) {
  const providers = Array.from(new Set(records.map(r => r.provider)));
  
  // Decide grouping based on range
  const daysDiff = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const isDaily = daysDiff > 0 && daysDiff <= 31;

  const groupMap = new Map<string, any>();

  records.forEach(r => {
    const key = isDaily 
      ? safeFormatDate(r.date, 'dd/MM', { locale: ptBR })
      : safeFormatDate(startOfMonth(r.date), 'MMM yyyy', { locale: ptBR });
    
    if (!key) return;
    
    if (!groupMap.has(key)) {
      groupMap.set(key, { 
        name: key, 
        date: isDaily ? startOfDay(r.date) : startOfMonth(r.date) 
      });
    }
    const entry = groupMap.get(key);
    entry[r.provider] = (entry[r.provider] || 0) + r.value;
  });

  const data = Array.from(groupMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const COLORS = ['#0f172a', '#9333ea', '#3b82f6', '#10b981', '#f59e0b'];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const formatCompact = (val: number) => {
    return val >= 1000 ? (val/1000).toFixed(1) + 'k' : val.toString();
  };

  return (
    <Card className="h-full shadow-sm flex flex-col overflow-hidden">
      <CardHeader className="py-3 shrink-0">
        <CardTitle className="text-sm font-bold text-slate-600">
          {isDaily ? 'Visão Geral - Gastos Diários (R$)' : 'Visão Geral - Gastos Mês a Mês (R$)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-4">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(value) => `R$ ${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
              {providers.map((p, idx) => (
                <Line 
                  key={p} 
                  type="monotone" 
                  dataKey={p} 
                  stroke={COLORS[idx % COLORS.length]} 
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                >
                  <LabelList 
                    dataKey={p} 
                    position="top" 
                    style={{ fill: COLORS[idx % COLORS.length], fontSize: '11px', fontWeight: 'bold' }} 
                    formatter={formatCompact}
                  />
                </Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
