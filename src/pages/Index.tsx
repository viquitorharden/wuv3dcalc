"use client";

import React, { useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import PrinterManager, { Printer } from '@/components/PrinterManager';
import FilamentManager, { Filament } from '@/components/FilamentManager';
import ExtraManager, { ExtraItem } from '@/components/ExtraManager';
import ResultsDisplay from '@/components/ResultsDisplay';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { 
  Settings2, 
  Calculator, 
  Clock, 
  Zap, 
  AlertTriangle, 
  Hammer, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Index = () => {
  // Persisted State
  const [currency, setCurrency] = useLocalStorage('calc_currency', 'R$');
  const [printers, setPrinters] = useLocalStorage<Printer[]>('calc_printers', []);
  const [filaments, setFilaments] = useLocalStorage<Filament[]>('calc_filaments', []);
  const [extras, setExtras] = useLocalStorage<ExtraItem[]>('calc_extras', []);
  const [selectedPrinterId, setSelectedPrinterId] = useLocalStorage('calc_selected_printer', '');
  const [selectedFilamentId, setSelectedFilamentId] = useLocalStorage('calc_selected_filament', '');
  const [electricityRate, setElectricityRate] = useLocalStorage('calc_elec_rate', 0.85);
  const [labourRate, setLabourRate] = useLocalStorage('calc_labour_rate', 30);
  
  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Job Inputs
  const [jobGrams, setJobGrams] = useState(50);
  const [jobHours, setJobHours] = useState(2);
  const [jobMinutes, setJobMinutes] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [failureRate, setFailureRate] = useState(10);
  const [postMinutes, setPostMinutes] = useState(15);
  const [profitMargin, setProfitMargin] = useState(50);

  // Derived Data
  const selectedPrinter = printers.find(p => p.id === selectedPrinterId);
  const selectedFilament = filaments.find(f => f.id === selectedFilamentId);

  const results = useMemo(() => {
    const totalHours = jobHours + (jobMinutes / 60);
    
    // 1. Filament Cost
    const costPerGram = selectedFilament 
      ? selectedFilament.price / selectedFilament.weightGrams 
      : 0.09; // Default fallback
    const filamentCost = jobGrams * costPerGram;

    // 2. Electricity Cost
    const watts = selectedPrinter?.powerWatts || 150;
    const electricityCost = (watts / 1000) * totalHours * electricityRate;

    // 3. Printer Wear
    const wearPerHour = selectedPrinter 
      ? (selectedPrinter.price / selectedPrinter.lifespanHours) + selectedPrinter.maintenancePerHour
      : 0.80; // Default fallback
    const printerWear = wearPerHour * totalHours;

    // 4. Failure Surcharge
    const baseCost = filamentCost + electricityCost + printerWear;
    const failureSurcharge = (failureRate / 100) * baseCost;

    // 5. Post-processing
    const postProcessingCost = (postMinutes / 60) * labourRate;

    // 6. Extras
    const extrasCost = extras.reduce((sum, item) => sum + item.price, 0);

    const subtotal = baseCost + failureSurcharge + postProcessingCost + extrasCost;
    const suggestedPrice = subtotal * (1 + profitMargin / 100);

    return {
      filamentCost,
      electricityCost,
      printerWear,
      failureSurcharge,
      postProcessingCost,
      extrasCost,
      subtotal,
      suggestedPrice,
      costPerGram,
      quantity: quantity > 0 ? quantity : 1
    };
  }, [
    jobGrams, jobHours, jobMinutes, failureRate, postMinutes, profitMargin,
    selectedPrinter, selectedFilament, electricityRate, labourRate, extras, quantity
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Calculator className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">3D PRINT CALC</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Calculadora de Custos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-full px-4">
          <CurrencySelector value={currency} onChange={setCurrency} />
          <div className="w-px h-6 bg-border" />
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs & Settings */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Settings Collapsible */}
          <Collapsible
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            className="w-full border rounded-xl overflow-hidden bg-card shadow-sm"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-between items-center p-6 h-auto hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">Configurações e Biblioteca</span>
                </div>
                {isSettingsOpen ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-6 pt-0 border-t">
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <PrinterManager 
                  printers={printers} 
                  onUpdate={setPrinters} 
                  selectedId={selectedPrinterId}
                  onSelect={setSelectedPrinterId}
                  currency={currency}
                />
                <FilamentManager 
                  filaments={filaments} 
                  onUpdate={setFilaments} 
                  selectedId={selectedFilamentId}
                  onSelect={setSelectedFilamentId}
                  currency={currency}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-8 pt-6 border-t">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Zap className="h-4 w-4" /> Custo Energia ({currency}/kWh)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={electricityRate} 
                    onChange={e => setElectricityRate(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Hammer className="h-4 w-4" /> Valor Mão de Obra ({currency}/h)</Label>
                  <Input 
                    type="number" 
                    value={labourRate} 
                    onChange={e => setLabourRate(Number(e.target.value))}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Job Inputs */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Dados da Impressão
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Peso Total (g)</Label>
                    <Input 
                      type="number" 
                      value={jobGrams} 
                      onChange={e => setJobGrams(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Layers className="h-4 w-4" /> Peças na Mesa
                    </Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={quantity} 
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="text-lg border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><Clock className="h-4 w-4" /> Tempo Total de Impressão</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input 
                        type="number" 
                        value={jobHours} 
                        onChange={e => setJobHours(Number(e.target.value))}
                        placeholder="Horas"
                      />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1 block">Horas</span>
                    </div>
                    <div className="flex-1">
                      <Input 
                        type="number" 
                        value={jobMinutes} 
                        onChange={e => setJobMinutes(Number(e.target.value))}
                        placeholder="Minutos"
                      />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1 block">Minutos</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-primary">Margem de Lucro (%)</Label>
                  <Input 
                    type="number" 
                    value={profitMargin} 
                    onChange={e => setProfitMargin(Number(e.target.value))}
                    className="border-primary/50 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Taxa de Falha (%)</Label>
                  <Input 
                    type="number" 
                    value={failureRate} 
                    onChange={e => setFailureRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Pós-processamento (min)</Label>
                  <Input 
                    type="number" 
                    value={postMinutes} 
                    onChange={e => setPostMinutes(Number(e.target.value))}
                  />
                </div>

                <div className="pt-2">
                  <ExtraManager extras={extras} onUpdate={setExtras} currency={currency} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <ResultsDisplay results={results} currency={currency} />
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                <strong>Dica:</strong> Insira o peso e tempo <strong>totais</strong> informados pelo seu fatiador. A calculadora dividirá os custos automaticamente pela quantidade de peças na mesa.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 pt-8 border-t">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;