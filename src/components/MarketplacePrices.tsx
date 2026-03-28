"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MarketplacePricesProps {
  targetPricePerUnit: number;
  currency: string;
}

const MarketplacePrices = ({ targetPricePerUnit, currency }: MarketplacePricesProps) => {
  const format = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Função de cálculo iterativo para convergir no preço correto considerando taxas dinâmicas
  const calculatePrice = (target: number, commission: number, getFixedFee: (p: number) => number) => {
    let price = target / (1 - commission); // Estimativa inicial
    
    // Máximo de 10 iterações para convergência (< R$ 0,01)
    for (let i = 0; i < 10; i++) {
      const fee = getFixedFee(price);
      
      // Caso especial: Taxa fixa de 50% do preço (Shopee < 8 e ML < 12.50)
      // Se a taxa for 50% do preço, a fórmula muda: Price = (Target) / (1 - commission - 0.5)
      let newPrice;
      if (fee === price * 0.5) {
        newPrice = target / (1 - commission - 0.5);
      } else {
        newPrice = (target + fee) / (1 - commission);
      }

      if (Math.abs(newPrice - price) < 0.01) return newPrice;
      price = newPrice;
    }
    return price;
  };

  const platforms = [
    {
      name: 'TikTok Shop',
      calculate: (target: number) => calculatePrice(target, 0.06, () => 4.00),
      description: '6% comissão + R$ 4,00 fixo',
      color: 'border-black dark:border-white'
    },
    {
      name: 'Shopee',
      calculate: (target: number) => calculatePrice(target, 0.14, (p) => {
        if (p < 8) return p * 0.5;
        if (p < 80) return 4.00;
        if (p < 100) return 16.00;
        if (p < 200) return 20.00;
        return 26.00;
      }),
      description: '14% comissão + Taxa fixa por faixa',
      color: 'border-orange-500'
    },
    {
      name: 'Amazon (Indiv.)',
      calculate: (target: number) => calculatePrice(target, 0.13, () => 2.00),
      description: '13% comissão + R$ 2,00 fixo',
      color: 'border-yellow-500'
    },
    {
      name: 'Amazon (Prof.)',
      calculate: (target: number) => calculatePrice(target, 0.13, () => 0.00),
      description: '13% comissão + R$ 0,00 fixo',
      color: 'border-yellow-600'
    },
    {
      name: 'ML Clássico',
      calculate: (target: number) => calculatePrice(target, 0.12, (p) => {
        if (p < 12.50) return p * 0.5;
        if (p < 80) return 6.75;
        return 0.00;
      }),
      description: '12% comissão + Taxa fixa por faixa',
      color: 'border-blue-400'
    },
    {
      name: 'ML Premium',
      calculate: (target: number) => calculatePrice(target, 0.16, (p) => {
        if (p < 12.50) return p * 0.5;
        if (p < 80) return 6.75;
        return 0.00;
      }),
      description: '16% comissão + Taxa fixa por faixa',
      color: 'border-blue-600'
    }
  ];

  return (
    <Card className="mt-6 border-2 border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" /> Preço Mínimo por Plataforma
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Valor de venda necessário para manter seu lucro por unidade ({currency} {format(targetPricePerUnit)})
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {platforms.map((p) => {
            const finalPrice = p.calculate(targetPricePerUnit);
            return (
              <div 
                key={p.name} 
                className={`p-3 rounded-xl border-l-4 bg-muted/30 flex justify-between items-center ${p.color}`}
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold uppercase tracking-tight">{p.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{p.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-lg font-black text-foreground">
                    {currency} {format(finalPrice)}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] opacity-70">
                  Info
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplacePrices;