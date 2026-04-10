import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FuelRecord } from '../types';

interface FuelChartsProps {
  records: FuelRecord[];
}

export default function FuelCharts({ records }: FuelChartsProps) {
  const litersData = [
    { name: 'Gasolina', value: records.filter(r => r.fuelType === 'Gasolina').reduce((acc, r) => acc + r.liters, 0) },
    { name: 'Diesel S10', value: records.filter(r => r.fuelType === 'Diesel S10').reduce((acc, r) => acc + r.liters, 0) }
  ];

  const costData = [
    { name: 'Gasolina', value: records.filter(r => r.fuelType === 'Gasolina').reduce((acc, r) => acc + r.value, 0) },
    { name: 'Diesel S10', value: records.filter(r => r.fuelType === 'Diesel S10').reduce((acc, r) => acc + r.value, 0) }
  ];

  const COLORS = ['#b91c1c', '#fca5a5']; // Dark Red, Light Red

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(val));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-center text-slate-600">
            Litragem por Combustível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={litersData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {litersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${formatNumber(value)} L`, 'Litros']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xs text-slate-500 font-medium">Total Litros</p>
              <p className="text-lg font-bold">{formatNumber(litersData.reduce((acc, d) => acc + d.value, 0))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-center text-slate-600">
            Custo por Combustível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Valor']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xs text-slate-500 font-medium">Valor Total</p>
              <p className="text-lg font-bold">{formatCurrency(costData.reduce((acc, d) => acc + d.value, 0))}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
