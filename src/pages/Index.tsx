"use client";

import React, { useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import PrinterManager, { Printer } from '@/components/PrinterManager';
import FilamentManager, { Filament } from '@/components/FilamentManager';
import ExtraManager, { ExtraItem } from '@/components/ExtraManager';
import ResultsDisplay from '@/components/ResultsDisplay';
import MarketplacePrices from '@/components/MarketplacePrices';
import SavePrintDialog from '@/components/SavePrintDialog';
import SavedPrintsManager, { SavedPrint } from '@/components/SavedPrintsManager';
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
  Layers,
  History
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const Index = () => {
  // Persisted State
  const [currency, setCurrency] = useLocalStorage('calc_currency', 'R$');
  const [printers, setPrinters] = useLocalStorage<Printer[]>('calc_printers', []);
  const [filaments, setFilaments] = useLocalStorage<Filament[]>('calc_filaments', []);
  const [extras, setExtras] = useLocalStorage<ExtraItem[]>('calc_extras', []);
  const [savedPrints, setSavedPrints] = useLocalStorage<SavedPrint[]>('calc_saved_prints', []);
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
    const safeQuantity = quantity > 0 ? quantity : 1;
    
    const costPerGram = selectedFilament 
      ? selectedFilament.price / selectedFilament.weightGrams 
      : 0.09; 
    const filamentCost = jobGrams * costPerGram;

    const watts = selectedPrinter?.powerWatts || 150;
    const electricityCost = (watts / 1000) * totalHours * electricityRate;

    const wearPerHour = selectedPrinter 
      ? (selectedPrinter.price / selectedPrinter.lifespanHours) + selectedPrinter.maintenancePerHour
      : 0.80; 
    const printerWear = wearPerHour * totalHours;

    const baseProductionCost = filamentCost + electricityCost + printerWear;
    const failureSurcharge = (failureRate / 100) * baseProductionCost;

    const totalPostMinutes = postMinutes * safeQuantity;
    const postProcessingCost = (totalPostMinutes / 60) * labourRate;

    const singleExtraCost = extras.reduce((sum, item) => sum + item.price, 0);
    const extrasCost = singleExtraCost * safeQuantity;

    const subtotal = baseProductionCost + failureSurcharge + postProcessingCost + extrasCost;
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
      quantity: safeQuantity
    };
  }, [
    jobGrams, jobHours, jobMinutes, failureRate, postMinutes, profitMargin,
    selectedPrinter, selectedFilament, electricityRate, labourRate, extras, quantity
  ]);

  const handleSavePrint = (name: string) => {
    const targetPricePerUnit = results.suggestedPrice / results.quantity;
    
    // Marketplace calculation logic (synced with MarketplacePrices component)
    const platforms = [
      { name: 'TikTok Shop', commission: 0.06, fixedFee: 5.06 },
      { name: 'Shopee (CPF)', commission: 0.14, fixedFee: 7 },
      { name: 'Shopee (CNPJ)', commission: 0.14, fixedFee: 4 },
      { name: 'Amazon (Indiv.)', commission: 0.15, fixedFee: 2 },
      { name: 'ML Clássico', commission: 0.14, fixedFee: 6.75 },
      { name: 'ML Premium', commission: 0.19, fixedFee: 6.75 }
    ];

    const marketplacePrices = platforms.map(p => ({
      name: p.name,
      price: (targetPricePerUnit + p.fixedFee) / (1 - p.commission)
    }));

    const newPrint: SavedPrint = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      currency,
      inputs: {
        jobGrams,
        jobHours,
        jobMinutes,
        quantity,
        profitMargin
      },
      results: {
        subtotal: results.subtotal,
        suggestedPrice: results.suggestedPrice,
        marketplacePrices
      }
    };
    setSavedPrints([newPrint, ...savedPrints]);
    toast.success("Impressão salva com sucesso!");
  };

  const handleDeleteSavedPrint = (id: string) => {
    setSavedPrints(savedPrints.filter(p => p.id !== id));
    toast.info("Impressão removida.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl shadow-sm border">
            <img 
              src="https://i.imgur.com/RQI3mui.png" 
              alt="WUV Studios Logo" 
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">WUV STUDIOS</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Calculadora 3D</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-full px-4">
          <CurrencySelector value={currency} onChange={setCurrency} />
          <div className="w-px h-6 bg-border" />
          <ThemeToggle />
        </div>
      </header>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" /> Calculadora
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" /> Histórico ({savedPrints.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Coluna 1: Configurações e Dados de Entrada */}
            <div className="space-y-6">
              <Collapsible
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                className="w-full border rounded-xl overflow-hidden bg-card shadow-sm"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex justify-between items-center p-6 h-auto hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5 text-primary" />
                      <span className="font-bold text-lg">Biblioteca</span>
                    </div>
                    {isSettingsOpen ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-6 pt-0 border-t">
                  <div className="space-y-8 mt-6">
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
                  <div className="grid grid-cols-1 gap-4 mt-8 pt-6 border-t">
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

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Dados da Impressão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Peso Lote (g)</Label>
                      <Input 
                        type="number" 
                        value={jobGrams} 
                        onChange={e => setJobGrams(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Layers className="h-4 w-4" /> Peças
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
                    <Label className="font-bold flex items-center gap-2"><Clock className="h-4 w-4" /> Tempo Total</Label>
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

                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label className="font-bold flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Taxa de Falha (%)</Label>
                      <Input 
                        type="number" 
                        value={failureRate} 
                        onChange={e => setFailureRate(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">Pós-processamento (min/peça)</Label>
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

            {/* Coluna 2: Resumo de Custos */}
            <div className="lg:sticky lg:top-8 space-y-6">
              <ResultsDisplay results={results} currency={currency} />
              <SavePrintDialog onSave={handleSavePrint} />
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  <strong>Nota:</strong> O peso e o tempo de impressão devem ser o <strong>total do lote</strong>. Itens extras e tempo de pós-processamento são considerados <strong>por unidade</strong>.
                </p>
              </div>
            </div>

            {/* Coluna 3: Preços de Marketplace */}
            <div className="lg:sticky lg:top-8">
              <MarketplacePrices 
                targetPricePerUnit={results.suggestedPrice / results.quantity} 
                currency={currency} 
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="max-w-2xl mx-auto">
            <SavedPrintsManager 
              prints={savedPrints} 
              onDelete={handleDeleteSavedPrint} 
              currency={currency} 
            />
          </div>
        </TabsContent>
      </Tabs>

      <footer className="mt-12 pt-8 border-t">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;