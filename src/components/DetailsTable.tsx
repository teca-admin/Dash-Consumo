import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FuelRecord } from '../types';

interface DetailsTableProps {
  records: FuelRecord[];
}

export default function DetailsTable({ records }: DetailsTableProps) {
  // Group by Equipment and Provider
  const groups = new Map<string, any>();

  records.forEach(r => {
    const key = `${r.equipment}|${r.provider}`;
    if (!groups.has(key)) {
      groups.set(key, {
        equipment: r.equipment,
        provider: r.provider,
        count: 0,
        liters: 0,
        value: 0
      });
    }
    const group = groups.get(key);
    group.count += 1;
    group.liters += r.liters;
    group.value += r.value;
  });

  const data = Array.from(groups.values()).sort((a, b) => a.equipment.localeCompare(b.equipment));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(val));
  };

  // Calculate totals for footer
  const totalCount = data.reduce((acc, d) => acc + d.count, 0);
  const totalLiters = data.reduce((acc, d) => acc + d.liters, 0);
  const totalValue = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <Card className="h-full shadow-sm flex flex-col overflow-hidden">
      <CardHeader className="bg-slate-50 border-b py-2 shrink-0">
        <CardTitle className="text-xs font-bold text-slate-600">
          Detalhamento de Abastecimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="font-bold text-slate-700 text-[10px] h-8">Equipamento</TableHead>
                <TableHead className="font-bold text-slate-700 text-[10px] h-8">Fornecedor</TableHead>
                <TableHead className="text-right font-bold text-slate-700 text-[10px] h-8">Abastecimentos</TableHead>
                <TableHead className="text-right font-bold text-slate-700 text-[10px] h-8">Litros Abastecidos</TableHead>
                <TableHead className="text-right font-bold text-slate-700 text-[10px] h-8">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={`${row.equipment}-${row.provider}-${idx}`} className="hover:bg-slate-50/50 transition-colors h-8">
                  <TableCell className="font-medium text-[11px] py-1">{row.equipment}</TableCell>
                  <TableCell className="text-[11px] py-1">{row.provider}</TableCell>
                  <TableCell className="text-right text-[11px] py-1">{row.count}</TableCell>
                  <TableCell className="text-right text-[11px] py-1">{formatNumber(row.liters)}</TableCell>
                  <TableCell className="text-right font-medium text-[11px] py-1">{formatCurrency(row.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="bg-slate-900 text-white font-bold text-[11px] shrink-0">
          <div className="flex items-center px-4 py-2 border-t border-slate-700">
            <div className="flex-1">Total Geral</div>
            <div className="flex gap-8">
              <div className="text-right min-w-[80px]">Abs: {totalCount}</div>
              <div className="text-right min-w-[100px]">L: {formatNumber(totalLiters)}</div>
              <div className="text-right min-w-[120px]">V: {formatCurrency(totalValue)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
