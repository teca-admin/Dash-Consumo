import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button, buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, RotateCcw, Table as TableIcon } from 'lucide-react';
import { cn, safeFormatDate } from '@/lib/utils';

interface HeaderProps {
  options: {
    ptms: string[];
    equipments: string[];
    providers: string[];
    fuels: string[];
  };
  filters: {
    dateRange: { from: Date | undefined; to: Date | undefined };
    selectedPTM: string;
    selectedEquipment: string;
    selectedProvider: string;
    selectedFuel: string;
  };
  setFilters: {
    setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
    setSelectedPTM: (val: string) => void;
    setSelectedEquipment: (val: string) => void;
    setSelectedProvider: (val: string) => void;
    setSelectedFuel: (val: string) => void;
  };
  onShowSpreadsheet: () => void;
  totalValue: number;
  totalLiters: number;
}

export default function Header({ options, filters, setFilters, onShowSpreadsheet, totalValue, totalLiters }: HeaderProps) {
  const resetFilters = () => {
    setFilters.setDateRange({ from: undefined, to: undefined });
    setFilters.setSelectedPTM('all');
    setFilters.setSelectedEquipment('all');
    setFilters.setSelectedProvider('all');
    setFilters.setSelectedFuel('all');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR').format(val);
  };

  return (
    <header className="bg-white text-slate-900 py-4 px-6 border-b border-slate-200 shadow-sm shrink-0">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
        <div className="flex items-center gap-4 shrink-0">
          <div className="p-1">
            <img 
              src="https://lh3.googleusercontent.com/d/1sNzDKhdh2zH8d8DoyqIjx8l5LzBEXN5g" 
              alt="WFS Logo" 
              className="h-24 lg:h-32 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="h-16 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Dashboard de
            </h1>
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Abastecimento
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex flex-wrap items-center gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
            {/* Summary Boxes */}
            <div className="flex gap-1.5 mr-2">
              <div className="bg-white border border-slate-200 rounded-md p-1.5 h-[48px] w-28 flex flex-col justify-center items-center text-center shadow-sm">
                <p className="text-[8px] font-black text-slate-500 uppercase leading-tight">Total Litros</p>
                <p className="text-[11px] font-bold text-slate-800 truncate w-full">{formatNumber(totalLiters)}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-1.5 h-[48px] w-28 flex flex-col justify-center items-center text-center shadow-sm">
                <p className="text-[8px] font-black text-slate-500 uppercase leading-tight">Valor Total Gasto</p>
                <p className="text-[11px] font-bold text-slate-800 truncate w-full">{formatCurrency(totalValue)}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-1.5 h-[48px] w-28 flex flex-col justify-center items-center text-center shadow-sm">
                <p className="text-[8px] font-black text-slate-500 uppercase leading-tight">Fornecedor</p>
                <p className="text-[10px] font-bold text-slate-800 truncate w-full">AUTO POSTO GASPETRO</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            {/* Filters */}
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-0.5">PTM</label>
                <Select value={filters.selectedPTM} onValueChange={setFilters.setSelectedPTM}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-7 w-20 text-[10px] shadow-sm">
                    <SelectValue placeholder="all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    {options.ptms.map(ptm => (
                      <SelectItem key={ptm} value={ptm}>{ptm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-0.5">Equipamento</label>
                <Select value={filters.selectedEquipment} onValueChange={setFilters.setSelectedEquipment}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-7 w-24 text-[10px] shadow-sm">
                    <SelectValue placeholder="all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    {options.equipments.map(eq => (
                      <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-0.5">Fornecedor</label>
                <Select value={filters.selectedProvider} onValueChange={setFilters.setSelectedProvider}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-7 w-24 text-[10px] shadow-sm">
                    <SelectValue placeholder="all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    {options.providers.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-0.5">Combustível</label>
                <Select value={filters.selectedFuel} onValueChange={setFilters.setSelectedFuel}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-7 w-24 text-[10px] shadow-sm">
                    <SelectValue placeholder="all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    {options.fuels.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase ml-0.5">Período</label>
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-[160px] justify-start text-left font-normal bg-white border-slate-200 text-slate-900 hover:bg-slate-50 h-7 text-[10px] shadow-sm",
                  !filters.dateRange.from && "text-slate-500"
                )}
              >
                <CalendarIcon className="mr-1.5 h-3 w-3 text-primary" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {safeFormatDate(filters.dateRange.from, "dd/MM/yy")} -{" "}
                      {safeFormatDate(filters.dateRange.to, "dd/MM/yy")}
                    </>
                  ) : (
                    safeFormatDate(filters.dateRange.from, "dd/MM/yy")
                  )
                ) : (
                  <span>Selecione</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to
                  }}
                  onSelect={(range) => setFilters.setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-1 mt-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onShowSpreadsheet}
              className="text-slate-500 hover:text-primary hover:bg-slate-50 h-7 w-7 border-slate-200 shadow-sm"
              title="Ver Planilha Original"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetFilters}
              className="text-slate-400 hover:text-primary hover:bg-slate-50 h-7 w-7"
              title="Redefinir Filtros"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
