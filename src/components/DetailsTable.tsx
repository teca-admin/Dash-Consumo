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
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-sm font-bold uppercase text-slate-600">
          Detalhamento de Abastecimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-slate-700">EQUIPAMENTO</TableHead>
                <TableHead className="font-bold text-slate-700">FORNECEDOR</TableHead>
                <TableHead className="text-right font-bold text-slate-700">ABASTECIMENTOS</TableHead>
                <TableHead className="text-right font-bold text-slate-700">LITROS ABASTECIDOS</TableHead>
                <TableHead className="text-right font-bold text-slate-700">VALOR TOTAL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={`${row.equipment}-${row.provider}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium">{row.equipment}</TableCell>
                  <TableCell>{row.provider}</TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.liters)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(row.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <tfoot className="bg-slate-900 text-white font-bold">
              <TableRow>
                <TableCell colSpan={2}>TOTAL GERAL</TableCell>
                <TableCell className="text-right">{totalCount}</TableCell>
                <TableCell className="text-right">{formatNumber(totalLiters)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalValue)}</TableCell>
              </TableRow>
            </tfoot>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
