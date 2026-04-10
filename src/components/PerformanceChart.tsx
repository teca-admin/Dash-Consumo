import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FuelRecord } from '../types';

interface PerformanceChartProps {
  records: FuelRecord[];
}

export default function PerformanceChart({ records }: PerformanceChartProps) {
  // Group by equipment and then by provider
  const equipmentMap = new Map<string, any>();
  const providers = Array.from(new Set(records.map(r => r.provider)));

  records.forEach(r => {
    if (!equipmentMap.has(r.equipment)) {
      equipmentMap.set(r.equipment, { name: r.equipment });
    }
    const entry = equipmentMap.get(r.equipment);
    entry[r.provider] = (entry[r.provider] || 0) + r.liters;
    entry.total = (entry.total || 0) + r.liters;
  });

  const data = Array.from(equipmentMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 8); // Top 8 equipments

  const COLORS = ['#0f172a', '#9333ea', '#3b82f6', '#10b981', '#f59e0b'];

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(val));
  };

  return (
    <Card className="h-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase text-slate-600">
          Performance de Abastecimento por Equipamento (Litros)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                height={80}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${formatNumber(value)} L`, '']}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              {providers.map((p, idx) => (
                <Bar 
                  key={p} 
                  dataKey={p} 
                  stackId="a" 
                  fill={COLORS[idx % COLORS.length]} 
                  radius={[idx === providers.length - 1 ? 4 : 0, idx === providers.length - 1 ? 4 : 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
