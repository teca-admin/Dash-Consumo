import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button, buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
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
}

export default function Header({ options, filters, setFilters }: HeaderProps) {
  const resetFilters = () => {
    setFilters.setDateRange({ from: undefined, to: undefined });
    setFilters.setSelectedPTM('all');
    setFilters.setSelectedEquipment('all');
    setFilters.setSelectedProvider('all');
    setFilters.setSelectedFuel('all');
  };

  return (
    <header className="bg-white text-slate-900 py-4 px-6 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-1">
            <img 
              src="https://lh3.googleusercontent.com/d/1sNzDKhdh2zH8d8DoyqIjx8l5LzBEXN5g" 
              alt="WFS Logo" 
              className="h-16 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="h-10 w-px bg-slate-200 hidden sm:block mx-2"></div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 hidden sm:block">
            DASHBOARD DE <span className="text-primary">ABASTECIMENTO</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-end justify-center lg:justify-end gap-4 w-full lg:w-auto">
          {/* PTM Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-36">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">PTM</label>
            <Select value={filters.selectedPTM} onValueChange={setFilters.setSelectedPTM}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-9">
                <SelectValue placeholder="PTM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos PTMs</SelectItem>
                {options.ptms.map(ptm => (
                  <SelectItem key={ptm} value={ptm}>{ptm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-44">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Equipamento</label>
            <Select value={filters.selectedEquipment} onValueChange={setFilters.setSelectedEquipment}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-9">
                <SelectValue placeholder="Equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Equipamentos</SelectItem>
                {options.equipments.map(eq => (
                  <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Provider Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-44">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Fornecedor</label>
            <Select value={filters.selectedProvider} onValueChange={setFilters.setSelectedProvider}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-9">
                <SelectValue placeholder="Fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Fornecedores</SelectItem>
                {options.providers.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fuel Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-36">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Combustível</label>
            <Select value={filters.selectedFuel} onValueChange={setFilters.setSelectedFuel}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-9">
                <SelectValue placeholder="Combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Combustíveis</SelectItem>
                {options.fuels.map(f => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Picker */}
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Período</label>
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full sm:w-[240px] justify-start text-left font-normal bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100 h-9",
                  !filters.dateRange.from && "text-slate-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
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
                  <span>Selecione o período</span>
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

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetFilters}
            className="text-slate-400 hover:text-primary hover:bg-slate-100 h-9 w-9"
            title="Redefinir Filtros"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
