"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Store, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MarketplacePricesProps {
  targetPricePerUnit: number;
  currency: string;
}

const MarketplacePrices = ({ targetPricePerUnit, currency }: MarketplacePricesProps) => {
  const format = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Formula: Price = (Target + FixedFee) / (1 - Commission)
  const platforms = [
    {
      name: 'TikTok Shop',
      commission: 0.06,
      fixedFee: 4 + 1.06,
      description: '6% comissão + R$4 fixo + R$1,06 SFP',
      color: 'border-black dark:border-white'
    },
    {
      name: 'Shopee (CPF)',
      commission: 0.14,
      fixedFee: 7,
      description: '14% comissão + R$7 fixo',
      color: 'border-orange-500'
    },
    {
      name: 'Shopee (CNPJ)',
      commission: 0.14,
      fixedFee: 4,
      description: '14% comissão + R$4 fixo',
      color: 'border-orange-600'
    },
    {
      name: 'Amazon (Indiv.)',
      commission: 0.15,
      fixedFee: 2,
      description: '15% comissão + R$2 fixo',
      color: 'border-yellow-500'
    },
    {
      name: 'ML Clássico',
      commission: 0.14,
      fixedFee: 6.75,
      description: '14% comissão + R$6,75 fixo (< R$79)',
      color: 'border-blue-400'
    },
    {
      name: 'ML Premium',
      commission: 0.19,
      fixedFee: 6.75,
      description: '19% comissão + R$6,75 fixo (< R$79)',
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
            const finalPrice = (targetPricePerUnit + p.fixedFee) / (1 - p.commission);
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
                  {(p.commission * 100).toFixed(0)}% + {currency}{p.fixedFee.toFixed(2)}
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