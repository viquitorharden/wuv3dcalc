"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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
    quantity: number;
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

  const productionCost = results.filamentCost + results.electricityCost + results.printerWear + results.failureSurcharge;
  const costWithoutExtras = results.subtotal - results.extrasCost;
  const costWithoutPost = results.subtotal - results.postProcessingCost;
  
  const total = results.subtotal || 1;
  const isMultiple = results.quantity > 1;

  return (
    <Card className="h-full border-2 border-primary/20 shadow-lg overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Resumo de Custos</CardTitle>
          {isMultiple && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {results.quantity} peças
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
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

        {/* Custo de Produção e Total */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Custo de Produção</p>
              <p className="text-2xl font-black text-primary">{currency} {format(productionCost)}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Preço Sugerido (Lote)</p>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">{currency} {format(results.suggestedPrice)}</p>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg space-y-1 border border-dashed">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-muted-foreground font-medium">Custo Total (com tudo):</span>
              <span className="font-bold">{currency} {format(results.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-muted-foreground">Sem itens extras:</span>
              <span className="font-medium">{currency} {format(costWithoutExtras)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-muted-foreground">Sem pós-processamento:</span>
              <span className="font-medium">{currency} {format(costWithoutPost)}</span>
            </div>
          </div>
        </div>

        {/* Valor por Unidade (se houver mais de uma peça) */}
        {isMultiple && (
          <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold tracking-wider">Custo por Peça</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{currency} {format(results.subtotal / results.quantity)}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold tracking-wider">Preço Sugerido / Peça</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{currency} {format(results.suggestedPrice / results.quantity)}</p>
            </div>
          </div>
        )}

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