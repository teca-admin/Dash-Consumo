import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FuelRecord } from '../types';

interface FuelChartsProps {
  records: FuelRecord[];
  onFilterFuel: (fuel: string) => void;
}

export default function FuelCharts({ records, onFilterFuel }: FuelChartsProps) {
  const litersData = [
    { name: 'Gasolina', value: records.filter(r => r.fuelType === 'Gasolina').reduce((acc, r) => acc + r.liters, 0) },
    { name: 'Diesel S10', value: records.filter(r => r.fuelType === 'Diesel S10').reduce((acc, r) => acc + r.liters, 0) }
  ];

  const costData = [
    { name: 'Gasolina', value: records.filter(r => r.fuelType === 'Gasolina').reduce((acc, r) => acc + r.value, 0) },
    { name: 'Diesel S10', value: records.filter(r => r.fuelType === 'Diesel S10').reduce((acc, r) => acc + r.value, 0) }
  ];

  const COLORS = ['#e11d48', '#fb7185']; // Primary Red, Lighter Red

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(val));
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <Card className="shadow-sm flex-1 flex flex-col min-h-[250px]">
        <CardHeader className="py-3 shrink-0">
          <CardTitle className="text-sm font-bold text-center text-slate-600">
            Litragem por Combustível
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-4">
          <div className="h-full w-full min-h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={litersData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data) => onFilterFuel(String(data.name))}
                  className="cursor-pointer"
                >
                  {litersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${formatNumber(value)} L`, 'Litros']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={30} iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[10px] text-slate-400 font-medium">Total</p>
              <p className="text-base font-bold text-slate-700">{formatNumber(litersData.reduce((acc, d) => acc + d.value, 0))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm flex-1 flex flex-col min-h-[250px]">
        <CardHeader className="py-3 shrink-0">
          <CardTitle className="text-sm font-bold text-center text-slate-600">
            Custo por Combustível
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-4">
          <div className="h-full w-full min-h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data) => onFilterFuel(String(data.name))}
                  className="cursor-pointer"
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Valor']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={30} iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[10px] text-slate-400 font-medium">Total</p>
              <p className="text-base font-bold text-slate-700">{formatCurrency(costData.reduce((acc, d) => acc + d.value, 0))}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
