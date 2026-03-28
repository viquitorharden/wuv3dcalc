"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ResultsDisplayProps {
  results: {
    filamentCost: number;
    electricityCost: number;
    printerWear: number;
    failureSurcharge: number;
    postProcessingCost: number;
    extrasCost: number;
    subtotal: number;
    suggestedPrice: number;
    costPerGram: number;
  };
  currency: string;
}

const ResultsDisplay = ({ results, currency }: ResultsDisplayProps) => {
  const format = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const items = [
    { label: 'Custo do Filamento', value: results.filamentCost, color: 'bg-blue-500' },
    { label: 'Energia Elétrica', value: results.electricityCost, color: 'bg-yellow-500' },
    { label: 'Desgaste da Impressora', value: results.printerWear, color: 'bg-orange-500' },
    { label: 'Margem de Falha', value: results.failureSurcharge, color: 'bg-red-500' },
    { label: 'Pós-processamento', value: results.postProcessingCost, color: 'bg-green-500' },
    { label: 'Itens Extras', value: results.extrasCost, color: 'bg-orange-400' },
  ];

  const total = results.subtotal || 1;

  return (
    <Card className="h-full border-2 border-primary/20 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center">Resumo de Custos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
              <span className="font-medium">{currency} {format(item.value)}</span>
            </div>
          ))}
        </div>

        <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
          {items.map((item) => (
            <div 
              key={item.label}
              className={item.color}
              style={{ width: `${(item.value / total) * 100}%` }}
            />
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold">Custo Total</p>
            <p className="text-2xl font-black text-primary">{currency} {format(results.subtotal)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground uppercase font-bold">Preço Sugerido</p>
            <p className="text-2xl font-black text-green-600 dark:text-green-400">{currency} {format(results.suggestedPrice)}</p>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Custo por grama: <span className="font-bold text-foreground">{currency} {results.costPerGram.toFixed(3)}/g</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;