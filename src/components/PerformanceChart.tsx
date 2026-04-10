import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
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
    <Card className="h-full shadow-sm flex flex-col overflow-hidden">
      <CardHeader className="py-3 shrink-0">
        <CardTitle className="text-sm font-bold text-slate-600">
          Performance de Abastecimento por Equipamento (Litros)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-4">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                height={60}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }}
              />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(value: number) => [`${formatNumber(value)} L`, '']}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
              {providers.map((p, idx) => (
                <Bar 
                  key={p} 
                  dataKey={p} 
                  stackId="a" 
                  fill={COLORS[idx % COLORS.length]} 
                  radius={[idx === providers.length - 1 ? 4 : 0, idx === providers.length - 1 ? 4 : 0, 0, 0]}
                >
                  {idx === providers.length - 1 && (
                    <LabelList 
                      dataKey="total" 
                      position="top" 
                      style={{ fill: '#64748b', fontSize: '12px', fontWeight: 'bold' }} 
                      formatter={formatNumber}
                    />
                  )}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
